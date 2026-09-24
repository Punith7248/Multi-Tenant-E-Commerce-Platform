/**
 * STORE  ·  the tenant itself: Store._id IS the storeId used everywhere else
 *
 * DESIGN NOTE
 * One store per vendor, for now. It's enforced by a unique index on `ownerId` (plus the matching
 * unique index on User.storeId), not by a convention. Nothing in this schema is one-to-one by
 * nature: `ownerId` is a plain reference, so allowing several stores later is a schema change of
 * just "drop the unique index". The real cost is elsewhere: `User.storeId` is a single value and the
 * whole auth layer assumes one `req.user.storeId`. Multi-store would mean a membership list on the user and
 * a "current store" chosen per request. That's why we pick 1:1 now: it keeps every tenant check a
 * one-liner. `ownerId` is `immutable`, so a store can't be reassigned to another user through the API.
 * `slug` is the public URL (/stores/acme-coffee), so it's lowercase, hyphen-separated and unique;
 * it's validated by regex here so bad slugs are rejected even if the controller forgets to slugify.
 * `logoUrl` is a Cloudinary https URL. `isActive` is the on/off switch: an inactive store's products
 * disappear from the public catalog and the vendor should be blocked from writing (NOT enforced yet: add
 * it in Week 2 with Store CRUD, see day-5-auth-rbac.md). It replaces the
 * pending/active/suspended enum from Day 1 (see the amendments note in day-1-architecture.md).
 *
 * INDEXES
 *  - slug: unique (storefront lookup by URL)
 *  - ownerId: unique (one store per vendor; also "find my store")
 *  - isActive: the public catalog resolves active stores with Store.distinct('_id', { isActive: true })
 */
const mongoose = require('mongoose');
const { SLUG_REGEX, isHttpsUrl } = require('../utils/model-validators');

const { Schema } = mongoose;

const storeSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 60,
      match: [SLUG_REGEX, 'Slug may only contain lowercase letters, numbers and single hyphens'],
    },

    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      immutable: true,
    },

    description: { type: String, trim: true, maxlength: 1000, default: '' },

    logoUrl: {
      type: String,
      trim: true,
      validate: { validator: (v) => !v || isHttpsUrl(v), message: 'logoUrl must be an https URL' },
    },

    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Store || mongoose.model('Store', storeSchema);
