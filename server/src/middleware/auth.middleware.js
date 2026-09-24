// AUTHENTICATION: "who is calling?"  -> 401 when the answer is "nobody we can trust".
//
//   const { authMiddleware } = require('../middleware/auth.middleware');
//   router.get('/me', authMiddleware, getMe);
//
// On success, req.user = { id, role, storeId } (storeId is null for customers and admins).
const AppError = require('../utils/app-error');
const User = require('../models/user.model');
const { ROLE_VALUES } = require('../utils/constants');
const { AUTH_COOKIE, verifyToken } = require('../utils/token');

// Async is fine: Express 5 forwards a throw/rejection from middleware to the error handler, so a bad
// token can never crash the process. verifyToken() throws JsonWebTokenError ("Invalid token") or
// TokenExpiredError ("Token expired"); error.middleware.js turns both into 401.
const authMiddleware = async (req, res, next) => {
  const token = req.cookies?.[AUTH_COOKIE];
  if (!token) throw new AppError(401, 'Not authenticated: please log in');

  const payload = verifyToken(token);

  // A correctly signed token with the wrong shape is still not one of ours.
  if (typeof payload.id !== 'string' || !ROLE_VALUES.includes(payload.role)) {
    throw new AppError(401, 'Invalid token');
  }

  // The token proves who they WERE when they logged in. This one small read (one field, by _id)
  // makes bans and deletions take effect immediately instead of when the 7-day token runs out.
  // (Role and storeId are immutable on the User model, so they can't have changed since login.)
  const user = await User.findById(payload.id).select('isActive').lean();
  if (!user) throw new AppError(401, 'The account for this token no longer exists');
  if (!user.isActive) throw new AppError(403, 'This account has been deactivated'); // same as login

  req.user = { id: payload.id, role: payload.role, storeId: payload.storeId ?? null };
  next();
};

module.exports = { authMiddleware };
