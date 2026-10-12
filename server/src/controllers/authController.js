import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Tenant from '../models/Tenant.js';
import { env } from '../config/env.js';
import { signToken } from '../utils/auth.js';

const slugify = (value) => `${value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${Date.now().toString(36)}`;
const cleanUser = (u) => ({ id: u._id, role: u.role, fullName: u.fullName, email: u.email, phone: u.phone, tenantId: u.tenantId, businessName: u.businessName, status: u.status });

export const registerCustomer = async (req, res) => {
  const { fullName, email, phone, password } = req.body;
  if (!fullName || !email || !password) return res.status(400).json({ message: 'Name, email and password are required' });
  if (password.length < 6) return res.status(400).json({ message: 'Password must contain at least 6 characters' });
  if (await User.findOne({ email: email.toLowerCase() })) return res.status(409).json({ message: 'Email already registered' });
  const user = await User.create({ role: 'customer', fullName, email: email.toLowerCase(), phone, passwordHash: await bcrypt.hash(password, 10), status: 'active' });
  const token = signToken({ sub: user._id.toString(), role: user.role, tenantId: null });
  res.status(201).json({ token, user: cleanUser(user) });
};

export const registerVendor = async (req, res) => {
  const { businessName, fullName, email, phone, password } = req.body;
  if (!businessName || !fullName || !email || !password) return res.status(400).json({ message: 'Business name, name, email and password are required' });
  if (password.length < 6) return res.status(400).json({ message: 'Password must contain at least 6 characters' });
  if (await User.findOne({ email: email.toLowerCase() })) return res.status(409).json({ message: 'Email already registered' });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ role: 'vendor', fullName, email: email.toLowerCase(), phone, passwordHash, status: 'pending', businessName });
  const tenant = await Tenant.create({ name: businessName, ownerId: user._id, slug: slugify(businessName), status: 'pending' });
  user.tenantId = tenant._id;
  await user.save();
  const token = signToken({ sub: user._id.toString(), role: user.role, tenantId: tenant._id.toString() });
  res.status(201).json({ token, user: cleanUser(user), tenant });
};

export const login = (role) => async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: String(email || '').toLowerCase(), role });
  if (!user || !(await bcrypt.compare(password || '', user.passwordHash))) return res.status(401).json({ message: 'Invalid email or password' });
  if (user.status === 'pending') return res.status(403).json({ message: 'Your vendor account is waiting for Super Admin approval' });
  if (user.status !== 'active') return res.status(403).json({ message: 'Your account is inactive' });
  const token = signToken({ sub: user._id.toString(), role: user.role, tenantId: user.tenantId?.toString() || null });
  res.json({ token, user: cleanUser(user) });
};

export const adminLogin = async (req, res) => {
  const { username, password } = req.body;
  if (username !== env.adminUsername || password !== env.adminPassword) return res.status(401).json({ message: 'Invalid admin credentials' });
  const token = signToken({ sub: '000000000000000000000000', role: 'super_admin', tenantId: null });
  res.json({ token, user: { id: '000000000000000000000000', role: 'super_admin', fullName: 'Super Admin', email: username } });
};

export const me = async (req, res) => res.json({ user: cleanUser(req.user) });
