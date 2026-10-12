import Product from '../models/Product.js';
import Tenant from '../models/Tenant.js';

export const listPublicProducts = async (req, res) => {
  const { store, category, q } = req.query;
  const filter = { active: true };
  if (store) {
    const tenant = await Tenant.findOne({ slug: store, status: 'approved' }).select('_id');
    if (!tenant) return res.status(404).json({ message: 'Store not found' });
    filter.tenantId = tenant._id;
  }
  if (category) filter.category = category;
  if (q) filter.$or = [{ name: { $regex: q, $options: 'i' } }, { description: { $regex: q, $options: 'i' } }];
  const products = await Product.find(filter).populate('tenantId', 'name slug').sort({ createdAt: -1 });
  res.json({ products });
};

export const listVendorProducts = async (req, res) => {
  const products = await Product.find({ tenantId: req.user.tenantId }).sort({ createdAt: -1 });
  res.json({ products });
};

export const getProduct = async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id, tenantId: req.user.tenantId });
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json({ product });
};

export const createProduct = async (req, res) => {
  const { name, description, category, price, stock, imageUrl } = req.body;
  if (!name || price === undefined) return res.status(400).json({ message: 'Name and price are required' });
  const product = await Product.create({ tenantId: req.user.tenantId, name, description, category, price: Number(price), stock: Number(stock || 0), imageUrl });
  res.status(201).json({ product });
};

export const updateProduct = async (req, res) => {
  const allowed = ['name','description','category','price','stock','imageUrl','active'];
  const updates = {};
  allowed.forEach(key => { if (req.body[key] !== undefined) updates[key] = req.body[key]; });
  if (updates.price !== undefined) updates.price = Number(updates.price);
  if (updates.stock !== undefined) updates.stock = Number(updates.stock);
  const product = await Product.findOneAndUpdate({ _id: req.params.id, tenantId: req.user.tenantId }, updates, { new: true, runValidators: true });
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json({ product });
};

export const deleteProduct = async (req, res) => {
  const product = await Product.findOneAndUpdate({ _id: req.params.id, tenantId: req.user.tenantId }, { active: false }, { new: true });
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json({ message: 'Product removed' });
};

export const stores = async (req, res) => {
  const result = await Tenant.find({ status: 'approved' }).select('name slug description logoUrl').sort({ name: 1 });
  res.json({ stores: result });
};
