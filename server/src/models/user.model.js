/**
 * USER  ·  the role field enforces role-based access (RBAC)
 *
 * DESIGN NOTE
 * The rule is: role === 'vendor'  <=>  storeId exists. Three things enforce it.
 *  (1) `storeId` is `required` only when role is vendor, and has a validator that rejects any value
 *      when role is customer/admin. So a vendor without a store, or a customer/admin with one, fails
 *      validation and never reaches the database.
 *  (2) `role` and `storeId` are `immutable`. Mongoose silently drops any later update to them, so the
 *      rule only has to hold at creation, and nobody can self-promote through PATCH /users/me
 *      (a mass-assignment attack). Promoting someone to admin is a manual/seed-script job by design.
 *  (3) `default: 'customer'` on role: if a code path forgets to set it, the user gets least privilege.
 * A vendor can't exist without a store, but Store.ownerId also points back at the User, so which is
 * created first? Neither: Mongoose generates ObjectIds in Node, so vendor registration pre-generates
 * BOTH ids, inserts the Store, then the User, and deletes the Store again if the User insert fails
 * (see registerVendor in auth.controller.js). That works on a plain local mongod; on an Atlas replica
 * set it can be swapped for session.withTransaction().
 *
 * PASSWORDS
 * The field is `password`, but it only holds plaintext in memory between assignment and save. The
 * pre('save') hook replaces it with a bcrypt hash (cost 12), and only when it is new or modified, so
 * saving a user for an unrelated reason (e.g. changing their name) never re-hashes an existing hash.
 * The minlength check runs BEFORE that hook, so it validates the plaintext. `select: false` keeps the
 * hash out of every query by default (login opts in with .select('+password')), and toJSON strips it
 * again, so a user object can be passed to res.json() safely.
 * WARNING: save hooks do NOT run for insertMany(), updateOne() or findOneAndUpdate(), which would store
 * a plaintext password. The guard at the bottom throws if an update query tries to set `password`.
 * To change a password: `user.password = newPlain; await user.save();`
 * The JSON shape of a user (see toJSON) is the public contract the API returns; don't add fields to
 * it casually. `email` is lowercased + trimmed before the unique index so "A@x.com" and "a@x.com"
 * collide. `isActive` lets an admin ban an account, which login and `authMiddleware` both check.
 *
 * INDEXES
 *  - email: unique
 *  - storeId: unique + partial (only when it's an ObjectId). One store per vendor, enforced at the
 *    database level, and customers/admins (no storeId) don't collide with each other.
 */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { ROLES, ROLE_VALUES } = require('../utils/constants');

const { Schema } = mongoose;

const BCRYPT_ROUNDS = 12;

// A real bcrypt hash of a random string nobody knows. Login compares against it when the email
// doesn't exist, so "unknown email" costs the same time as "wrong password" (no timing leak).
const DUMMY_HASH = '$2b$12$6rHm83.sQYPQPzmiYfSqI.Hp1N.4i7iJwn2FnQfPcYTT80omFiI1y';

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email address'],
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },

    role: {
      type: String,
      enum: { values: ROLE_VALUES, message: '{VALUE} is not a valid role' },
      default: ROLES.CUSTOMER,
      immutable: true,
    },

    // Deliberately NO default: customers/admins must not have the field at all (not even null),
    // otherwise the unique partial index below would see it.
    storeId: {
      type: Schema.Types.ObjectId,
      ref: 'Store',
      immutable: true,
      required: [
        function () {
          return this.role === ROLES.VENDOR;
        },
        'A vendor must have a storeId',
      ],
      validate: {
        validator: function (value) {
          return value == null || this.role === ROLES.VENDOR;
        },
        message: 'Only a vendor can have a storeId',
      },
    },

    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    // The public shape of a user:
    //   { id, name, email, role, storeId (vendors only), isActive, createdAt, updatedAt }
    toJSON: {
      virtuals: true, // adds `id` (string) ...
      transform(_doc, ret) {
        delete ret._id; // ... so we don't also send `_id`
        delete ret.__v;
        delete ret.password;
        return ret;
      },
    },
  }
);

userSchema.index({ storeId: 1 }, { unique: true, partialFilterExpression: { storeId: { $type: 'objectId' } } });

// Hash only when the password is new or was changed.
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, BCRYPT_ROUNDS);
});

// Requires the user to have been loaded with .select('+password').
userSchema.methods.comparePassword = async function (candidate) {
  if (!this.password) {
    throw new Error('comparePassword needs the password field: load the user with .select("+password")');
  }
  return bcrypt.compare(candidate, this.password);
};

// Burns the same time as a real comparison. Used by login when the email doesn't exist.
userSchema.statics.burnPasswordCheck = function (candidate) {
  return bcrypt.compare(candidate, DUMMY_HASH);
};

// Update queries skip the save hook above, so refuse to let them touch `password` at all.
userSchema.pre(['updateOne', 'updateMany', 'findOneAndUpdate', 'replaceOne', 'findOneAndReplace'], function () {
  const update = this.getUpdate() || {};
  const setsPassword = 'password' in update || 'password' in (update.$set || {}) || 'password' in (update.$setOnInsert || {});
  if (setsPassword) {
    throw new Error('Never set password with an update query (it would skip hashing): use user.password = ...; await user.save()');
  }
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
