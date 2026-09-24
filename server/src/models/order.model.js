/**
 * ORDER  ·  storeId is the tenant key; one Order document = exactly one store
 *
 * DESIGN NOTE: THE MULTI-VENDOR CART DECISION (Week 3 checkout depends on this)
 * A cart with items from two vendors becomes TWO Order documents, one per store, and both carry the
 * SAME `paymentIntentId`, because the customer pays once (one Stripe PaymentIntent for the summed total).
 * Why: (1) `storeId` stays a single value, so the vendor filter `{ storeId: req.user.storeId }` is a plain
 * equality with no array matching, and a vendor can never see another vendor's line items; (2) each
 * vendor moves their own order through paid > shipped > delivered independently (A ships Monday, B
 * Thursday); (3) cancelling or refunding one store's part doesn't touch the other's, and Stripe supports
 * partial refunds on a shared PaymentIntent. Consequences for checkout code:
 *   - group cart items by storeId, then create one Order per group;
 *   - paymentIntentId is therefore NOT unique. It's indexed, and a single group of orders shares it;
 *   - the webhook does Order.updateMany({ paymentIntentId, status: 'pending' }, { status: 'paid' });
 *   - all-or-nothing: create every order, decrement stock and create the PaymentIntent inside one
 *     transaction, so a stock failure on store B doesn't leave store A's order behind;
 *   - "my orders" for a customer is a flat list of per-store orders; group them by paymentIntentId
 *     in the UI to show one purchase.
 * SNAPSHOTS: each item copies `name`, `price` (integer cents) and `variantLabel` at purchase time, so
 * later product edits, price changes or deletions never rewrite history. `productId`/`variantId` are kept
 * only as links. `totalAmount` is computed by a pre('validate') hook from the items (never trusted from
 * the client), and `items`/`totalAmount`/`customerId`/`storeId` are immutable after creation.
 * `status` is checked against the enum here; the legal *transitions* live in
 * constants.ORDER_STATUS_TRANSITIONS and are applied in the controller with an atomic filter
 * ({ _id, storeId, status: from }) so two concurrent updates can't both win.
 * `shippingAddress` is embedded (a copy taken at checkout), not a ref, so editing an address later
 * doesn't change where an old order was sent.
 *
 * INDEXES
 *  - { storeId: 1, status: 1, createdAt: -1 }   the vendor's order list, filtered by status
 *  - { customerId: 1, createdAt: -1 }           "my orders"
 *  - { paymentIntentId: 1 }                     webhook lookup + grouping a checkout's orders
 */
const mongoose = require('mongoose');
const { ORDER_STATUS, ORDER_STATUS_VALUES } = require('../utils/constants');
const { integerCents } = require('../utils/model-validators');

const { Schema } = mongoose;

const orderItemSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    variantId: { type: Schema.Types.ObjectId }, // only for products with variants
    name: { type: String, required: true, trim: true },
    variantLabel: { type: String, trim: true }, // e.g. "M / Red"
    price: { type: Number, required: true, min: 0, validate: integerCents }, // cents, at purchase time
    quantity: {
      type: Number,
      required: true,
      min: 1,
      validate: { validator: Number.isInteger, message: 'quantity must be a whole number' },
    },
  },
  { _id: false }
);

const shippingAddressSchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    line1: { type: String, required: true, trim: true },
    line2: { type: String, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, trim: true },
    postalCode: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true, uppercase: true, minlength: 2, maxlength: 2 }, // ISO-3166 alpha-2
    phone: { type: String, trim: true },
  },
  { _id: false }
);

const orderSchema = new Schema(
  {
    customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, immutable: true },
    storeId: { type: Schema.Types.ObjectId, ref: 'Store', required: true, immutable: true },

    items: {
      type: [orderItemSchema],
      immutable: true,
      validate: { validator: (arr) => arr.length > 0, message: 'An order needs at least one item' },
    },

    totalAmount: { type: Number, required: true, min: 0, immutable: true, validate: integerCents }, // cents

    status: {
      type: String,
      enum: { values: ORDER_STATUS_VALUES, message: '{VALUE} is not a valid order status' },
      default: ORDER_STATUS.PENDING,
    },

    // Stripe PaymentIntent id. SHARED by every order created in the same checkout, so not unique.
    paymentIntentId: { type: String, trim: true },

    shippingAddress: { type: shippingAddressSchema, required: true },
  },
  { timestamps: true }
);

orderSchema.pre('validate', function () {
  if (this.isNew) {
    this.totalAmount = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }
});

orderSchema.index({ storeId: 1, status: 1, createdAt: -1 });
orderSchema.index({ customerId: 1, createdAt: -1 });
orderSchema.index({ paymentIntentId: 1 });

module.exports = mongoose.models.Order || mongoose.model('Order', orderSchema);
