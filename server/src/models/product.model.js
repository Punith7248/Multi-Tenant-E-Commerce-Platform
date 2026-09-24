/**
 * PRODUCT  ·  the storeId field enforces tenant isolation
 *
 * DESIGN NOTE
 * `storeId` is required and `immutable`: every product belongs to exactly one store from the moment
 * it's created and can never be moved, even if a buggy controller passes req.body into an update.
 * On writes it's always stamped from `req.user.storeId`, never from the request body, and every vendor
 * query includes it: `Product.findOne({ _id, storeId: req.user.storeId })`.
 * Money: `price` is an INTEGER NUMBER OF CENTS (1999 = $19.99), enforced by a validator.
 * Variants (size/color) are an embedded array because they have no life outside their product. Each
 * has its own `_id` (orders reference it as variantId) and its own `stock`. STOCK RULE: if `variants`
 * is empty, the product-level `stock` is the stock; if variants exist, each variant's `stock` is
 * authoritative and the product-level `stock` is ignored. The `availableStock` virtual gives the right
 * number either way, and nothing derived is stored, so it can't go stale. Decrement stock atomically at
 * checkout, never read-then-write:
 *   no variants:  updateOne({ _id, stock: { $gte: qty } },                          { $inc: { stock: -qty } })
 *   variant:      updateOne({ _id, variants: { $elemMatch: { _id: vid, stock: { $gte: qty } } } },
 *                           { $inc: { 'variants.$.stock': -qty } })
 * If matchedCount is 0 the item is out of stock, so fail the checkout.
 * `images` is an array of Cloudinary https URLs (max 5). We upload to `stores/{storeId}/products`, so the
 * Cloudinary public_id can be recovered from the URL when deleting; if that gets brittle, change the
 * element to { url, publicId }. `category` is a normalised lowercase string for now (there's no Category
 * model yet); if we add one later it's a migration from string to ref. `isActive` false hides the product
 * (draft/archived). Products are never hard-deleted because orders reference them, though orders also
 * snapshot name/price so they'd survive anyway.
 * Cross-field rules (no duplicate size+color, at least one of them per variant) run in a pre('validate')
 * hook, which fires on create() and save() but NOT on findOneAndUpdate. Zod is the first line of defence
 * on the request; for edits that touch `variants`, load with findOne({ _id, storeId }) then .save().
 *
 * INDEXES  (a compound index also serves queries on its leading field, so a separate { storeId: 1 } index
 * would be pure write overhead. Both indexes below lead with storeId.)
 *  - { storeId: 1, createdAt: -1 }   vendor's product list, newest first, and any storeId-only filter
 *  - { storeId: 1, category: 1 }     vendor filtering by category
 *  - { isActive: 1, category: 1, createdAt: -1 }   public catalog browsing across all stores
 *  - text on name + description      public search. It's a plain text index (not prefixed with storeId) so
 *                                    it can serve cross-store search; vendor search adds the storeId filter
 */
const mongoose = require('mongoose');
const { isHttpsUrl, integerCents } = require('../utils/model-validators');

const { Schema } = mongoose;

const variantSchema = new Schema({
  sku: { type: String, trim: true, uppercase: true, maxlength: 40 },
  size: { type: String, trim: true, maxlength: 30 },
  color: { type: String, trim: true, maxlength: 30 },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
    validate: { validator: Number.isInteger, message: '{PATH} must be a whole number' },
  },
});

const productSchema = new Schema(
  {
    storeId: { type: Schema.Types.ObjectId, ref: 'Store', required: true, immutable: true },

    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 120 },
    description: { type: String, trim: true, maxlength: 5000, default: '' },

    price: { type: Number, required: true, min: 0, validate: integerCents },
    stock: {
      type: Number,
      min: 0,
      default: 0,
      validate: { validator: Number.isInteger, message: '{PATH} must be a whole number' },
    },

    images: {
      type: [String],
      default: [],
      validate: [
        { validator: (arr) => arr.length <= 5, message: 'A product can have at most 5 images' },
        { validator: (arr) => arr.every(isHttpsUrl), message: 'Every image must be an https URL' },
      ],
    },

    variants: { type: [variantSchema], default: [] },

    category: { type: String, required: true, trim: true, lowercase: true, maxlength: 60 },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

productSchema.virtual('availableStock').get(function () {
  return this.variants.length ? this.variants.reduce((sum, v) => sum + v.stock, 0) : this.stock;
});

productSchema.pre('validate', function () {
  const seen = new Set();
  for (const variant of this.variants) {
    if (!variant.size && !variant.color) {
      this.invalidate('variants', 'Each variant needs a size, a color, or both');
      return;
    }
    const key = `${(variant.size || '').toLowerCase()}|${(variant.color || '').toLowerCase()}`;
    if (seen.has(key)) {
      this.invalidate('variants', 'Duplicate variant (same size and color)');
      return;
    }
    seen.add(key);
  }
});

productSchema.index({ storeId: 1, createdAt: -1 });
productSchema.index({ storeId: 1, category: 1 });
productSchema.index({ isActive: 1, category: 1, createdAt: -1 });
productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);
