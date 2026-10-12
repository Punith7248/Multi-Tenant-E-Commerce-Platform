import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { env } from '../config/env.js';

export const signToken = (payload) => jwt.sign(payload, env.jwtSecret, { expiresIn: '7d' });

export const auth = async (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'Authentication required' });
    const decoded = jwt.verify(token, env.jwtSecret);
    if (decoded.role === 'super_admin') {
      req.user = { _id: decoded.sub, role: 'super_admin', tenantId: null, fullName: 'Super Admin', email: env.adminUsername };
      return next();
    }
    const user = await User.findById(decoded.sub).lean();
    if (!user || user.status !== 'active') return res.status(403).json({ message: 'Your account is not active' });
    req.user = user;
    next();
  } catch { res.status(401).json({ message: 'Invalid or expired token' }); }
};

export const requireRole = (...roles) => (req, res, next) => roles.includes(req.user?.role) ? next() : res.status(403).json({ message: 'Access denied' });
