// AUTHORIZATION: "is this caller allowed?"  -> 403 when they are logged in but not allowed.
// (401 = we don't know who you are, 403 = we know exactly who you are, and the answer is no.)
// Always place these AFTER authMiddleware, because they read req.user.
//
//   const { authMiddleware } = require('../middleware/auth.middleware');
//   const { restrictTo, ownsStore, storeIdOf } = require('../middleware/rbac.middleware');
//
//   router.get('/admin-only',     authMiddleware, restrictTo('admin'), handler);
//   router.post('/products',      authMiddleware, restrictTo('vendor'), createProduct);   // stamp req.user.storeId
//   router.patch('/products/:id', authMiddleware, restrictTo('vendor'), ownsStore(storeIdOf(Product)), updateProduct);
const AppError = require('../utils/app-error');
const { ROLES, ROLE_VALUES } = require('../utils/constants');

// ROLE check: restrictTo('vendor') or restrictTo('vendor', 'admin').
// A typo like restrictTo('vender') would silently lock everyone out, so it throws when the route is
// defined, which means the server refuses to boot instead of failing in production.
const restrictTo = (...roles) => {
  if (roles.length === 0 || !roles.every((role) => ROLE_VALUES.includes(role))) {
    throw new Error(`restrictTo() needs one or more of [${ROLE_VALUES.join(', ')}], got [${roles.join(', ')}]`);
  }

  return (req, res, next) => {
    if (!req.user) throw new AppError(401, 'Not authenticated'); // used without authMiddleware
    if (!roles.includes(req.user.role)) {
      throw new AppError(403, 'You do not have permission to perform this action');
    }
    next();
  };
};

// Default way to find the store a request is about: a `:storeId` in the URL (e.g. /stores/:storeId/...).
const storeIdFromParams = (req) => {
  if (req.params.storeId === undefined) {
    throw new Error('ownsStore() with no argument needs a :storeId route parameter; pass a resolver instead');
  }
  return req.params.storeId;
};

// Builds a resolver for "the resource in :id belongs to some store": loads it and returns its storeId,
// or undefined if it doesn't exist. Works for any model that has a storeId (Product, Order).
//   ownsStore(storeIdOf(Product))              // uses req.params.id
//   ownsStore(storeIdOf(Order, 'orderId'))     // uses req.params.orderId
// An invalid id makes Mongoose throw a CastError, which the error handler turns into a 400.
const storeIdOf = (Model, param = 'id') => async (req) => {
  const doc = await Model.findById(req.params[param]).select('storeId').lean();
  return doc ? doc.storeId : undefined;
};

// THE MULTI-TENANT BOUNDARY. A vendor may only touch data that belongs to their own store.
//   1. `resolveStoreId(req)` says which store the target belongs to (default: the :storeId URL param).
//   2. It is compared with req.user.storeId, which came from the signed token and can't be forged.
//   - admin  -> always allowed (a super admin oversees every tenant)
//   - vendor -> allowed only when the two storeIds match; otherwise 403
//   - customer or anyone else -> 403 (they don't have a store)
//   - target doesn't exist -> 404
// Two safe places for this rule to hold: this check before the controller, and inside the controller's
// own query (findOne({ _id, storeId: req.user.storeId })). Use both for anything that writes.
// This is safe to do as check-then-act because storeId is immutable on Product and Order, so it can't
// change between this check and the controller. Trade-off: 403 (vs 404) tells a vendor that an id exists
// in another store; ObjectIds aren't guessable secrets, so we accept that for clearer errors.
const ownsStore = (resolveStoreId = storeIdFromParams) => async (req, res, next) => {
  if (!req.user) throw new AppError(401, 'Not authenticated');
  if (req.user.role === ROLES.ADMIN) return next();
  if (req.user.role !== ROLES.VENDOR || !req.user.storeId) {
    throw new AppError(403, 'Only the owner of a store can do this');
  }

  const targetStoreId = await resolveStoreId(req);
  if (targetStoreId == null) throw new AppError(404, 'Resource not found');
  if (String(targetStoreId) !== String(req.user.storeId)) {
    throw new AppError(403, "You can only access your own store's data");
  }
  next();
};

module.exports = { restrictTo, ownsStore, storeIdOf };
