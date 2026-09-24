const { z } = require('zod');
const { ROLES } = require('../utils/constants');

// Friendly messages for the two most common mistakes: field missing, or the wrong type.
const text = (label) =>
  z.string({ error: (issue) => (issue.input === undefined ? `${label} is required` : `${label} must be text`) });

// trim + lowercase first, then check the format, so " Ann@X.com " is stored as "ann@x.com".
const email = text('Email').trim().toLowerCase().pipe(z.email('Invalid email address'));

// bcrypt only uses the first 72 BYTES of a password, so longer input is rejected, not silently cut.
const password = text('Password')
  .min(8, 'Password must be at least 8 characters')
  .refine((value) => Buffer.byteLength(value, 'utf8') <= 72, 'Password must be at most 72 bytes');

// strictObject: unknown keys (storeId, isActive, ...) are rejected instead of ignored, so a client
// can never smuggle extra fields into the create call.
const registerSchema = z
  .strictObject({
    name: text('Name').trim().min(2, 'Name must be at least 2 characters').max(80, 'Name must be at most 80 characters'),
    email,
    password,
    // "admin" is deliberately not accepted here: admins are created by the seed script only.
    role: z.enum([ROLES.CUSTOMER, ROLES.VENDOR], { error: 'Role must be "customer" or "vendor"' }).default(ROLES.CUSTOMER),
    storeName: text('Store name').trim().min(2, 'Store name must be at least 2 characters').max(80, 'Store name must be at most 80 characters').optional(),
  })
  .superRefine((data, ctx) => {
    if (data.role === ROLES.VENDOR && !data.storeName) {
      ctx.addIssue({ code: 'custom', path: ['storeName'], message: 'Store name is required when registering as a vendor' });
    }
    if (data.role !== ROLES.VENDOR && data.storeName !== undefined) {
      ctx.addIssue({ code: 'custom', path: ['storeName'], message: 'Store name is only for vendors' });
    }
  });

// No length/strength rules on login: those belong to registration, not to checking credentials.
const loginSchema = z.strictObject({
  email,
  password: text('Password').min(1, 'Password is required'),
});

module.exports = { registerSchema, loginSchema };
