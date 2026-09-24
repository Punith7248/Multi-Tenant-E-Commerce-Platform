// Small validators shared by more than one schema.

// URL-safe slug: lowercase words joined by single hyphens ("acme-coffee-2").
const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const isHttpsUrl = (value) => typeof value === 'string' && /^https:\/\/\S+$/.test(value);

// Money is stored as integer cents everywhere (1999 = $19.99), so no floating-point rounding
// and it matches what Stripe expects. This rejects 19.99 before it reaches the database.
const integerCents = {
  validator: Number.isInteger,
  message: '{PATH} must be a whole number of cents (e.g. 1999 for $19.99)',
};

module.exports = { SLUG_REGEX, isHttpsUrl, integerCents };
