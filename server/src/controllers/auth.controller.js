const mongoose = require('mongoose');
const User = require('../models/user.model');
const Store = require('../models/store.model');
const AppError = require('../utils/app-error');
const slugify = require('../utils/slugify');
const { ROLES } = require('../utils/constants');
const { signToken, setAuthCookie, clearAuthCookie } = require('../utils/token');

// No try/catch and no wrapper needed: Express 5 forwards anything thrown or rejected in an async
// handler to the central error handler (Day 3). Throw an AppError for expected failures.

// VENDOR REGISTRATION DECISION
// A vendor cannot exist without a store (Day 2: the User schema rejects a vendor with no storeId), so
// the Store is created HERE, at registration, with just a name and a slug derived from it. "Later"
// isn't possible without weakening the schema. Week 2's Store CRUD then only edits it (description,
// logo, ...). The two ids are generated up front because User.storeId and Store.ownerId point at each
// other. Store goes in first, then the User; if the User insert fails, the Store is deleted again.
const registerVendor = async ({ name, email, password, storeName }) => {
  const slug = slugify(storeName);
  if (!slug) throw new AppError(400, 'Validation failed', { storeName: 'Store name must contain letters or numbers' });
  if (await Store.exists({ slug })) throw new AppError(409, 'A store with this name already exists');

  const userId = new mongoose.Types.ObjectId();
  const storeId = new mongoose.Types.ObjectId();

  await Store.create({ _id: storeId, ownerId: userId, name: storeName, slug });
  try {
    return await User.create({ _id: userId, name, email, password, role: ROLES.VENDOR, storeId });
  } catch (error) {
    await Store.deleteOne({ _id: storeId }); // don't leave an orphan store behind
    throw error;
  }
};

// POST /api/auth/register
// body (already validated + cleaned by validate(registerSchema)):
//   { name, email, password, role: 'customer' | 'vendor' (default 'customer'), storeName (vendors only) }
const register = async (req, res) => {
  const { name, email, password, role, storeName } = req.body;

  if (await User.exists({ email })) throw new AppError(409, 'An account with this email already exists');

  // The password is hashed by the User model's pre('save') hook; never hash it here.
  const user =
    role === ROLES.VENDOR
      ? await registerVendor({ name, email, password, storeName })
      : await User.create({ name, email, password, role });

  // user.toJSON() (called by res.json) drops the password.
  res.status(201).json({ success: true, message: 'Registered successfully', data: { user } });
};

// POST /api/auth/login
// body (validated): { email, password }
const login = async (req, res) => {
  const { email, password } = req.body;

  // password is select:false, so it has to be asked for explicitly here.
  const user = await User.findOne({ email }).select('+password');

  // Same error, and same time spent, whether the email is unknown or the password is wrong:
  // for an unknown email we still run a bcrypt comparison against a dummy hash.
  const passwordMatches = user ? await user.comparePassword(password) : await User.burnPasswordCheck(password);
  if (!user || !passwordMatches) throw new AppError(401, 'Invalid email or password');

  // Checked only AFTER the password matched, so it can't be used to probe which emails exist.
  if (!user.isActive) throw new AppError(403, 'This account has been deactivated');

  // The token travels in an httpOnly cookie, NOT in the body, so this response is exactly what Day 4 returned.
  setAuthCookie(res, signToken(user));

  res.status(200).json({ success: true, message: 'Logged in successfully', data: { user } });
};

// POST /api/auth/logout
// Needs no authMiddleware: clearing the cookie is harmless and must work even with an expired token.
const logout = (req, res) => {
  clearAuthCookie(res);
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

// GET /api/auth/me   (behind authMiddleware)
const getMe = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) throw new AppError(401, 'The account for this token no longer exists');
  res.status(200).json({ success: true, data: { user } });
};

module.exports = { register, login, logout, getMe };
