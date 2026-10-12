import User from '../models/User.js';
import Tenant from '../models/Tenant.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

export const overview = async (req, res) => {
  const [customers, vendors, orders, sales, products] = await Promise.all([
    User.countDocuments({ role: 'customer' }),
    User.countDocuments({ role: 'vendor' }),
    Order.countDocuments(),
    Order.aggregate([{ $match: { paymentStatus: 'paid' } }, { $group: { _id: null, total: { $sum: '$total' } } }]),
    Product.countDocuments({ active: true })
  ]);
  res.json({ customers, vendors, orders, products, sales: sales[0]?.total || 0 });
};

export const customers = async (req, res) => res.json({ customers: await User.find({ role: 'customer' }).select('-passwordHash').sort({ createdAt: -1 }) });
export const vendors = async (req, res) => res.json({ vendors: await User.find({ role: 'vendor' }).select('-passwordHash').populate('tenantId').sort({ createdAt: -1 }) });

export const approveVendor = async (req, res) => {
  const vendor = await User.findOne({ _id: req.params.id, role: 'vendor' });
  if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
  vendor.status = 'active';
  await vendor.save();
  await Tenant.findByIdAndUpdate(vendor.tenantId, { status: 'approved' });
  res.json({ message: 'Vendor approved' });
};

export const suspendVendor = async (req, res) => {
  const vendor = await User.findOne({ _id: req.params.id, role: 'vendor' });
  if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
  vendor.status = 'inactive';
  await vendor.save();
  await Tenant.findByIdAndUpdate(vendor.tenantId, { status: 'suspended' });
  res.json({ message: 'Vendor suspended' });
};

export const activateVendor = async (req, res) => {
  const vendor = await User.findOne({ _id: req.params.id, role: 'vendor' });
  if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
  vendor.status = 'active';
  await vendor.save();
  await Tenant.findByIdAndUpdate(vendor.tenantId, { status: 'approved' });
  res.json({ message: 'Vendor activated' });
};

export const analytics = async (req, res) => {
  const byStatus = await Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 }, revenue: { $sum: '$total' } } }]);
  const topProducts = await Order.aggregate([{ $unwind: '$items' }, { $group: { _id: '$items.productId', name: { $first: '$items.name' }, quantity: { $sum: '$items.quantity' }, revenue: { $sum: { $multiply: ['$items.quantity','$items.price'] } } } }, { $sort: { revenue: -1 } }, { $limit: 10 }]);
  res.json({ byStatus, topProducts });
};
