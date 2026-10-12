import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Tenant from '../models/Tenant.js';
import User from '../models/User.js';
import { sendEmail } from '../services/integrations.js';

const notify = async (order) => {
  const customer = await User.findById(order.customerId).select('email fullName');
  if (!customer?.email) return;
  await sendEmail({ to: customer.email, subject: `NovaCart order ${order._id}`, html: `<h2>Order confirmed</h2><p>Hi ${customer.fullName}, your order <b>${order._id}</b> is ${order.status}.</p><p>Total: ₹${order.total.toFixed(2)}</p>` });
};

export const createOrder = async (req, res) => {
  const { items, shipping } = req.body;
  if (!Array.isArray(items) || !items.length) return res.status(400).json({ message: 'Cart is empty' });
  const ids = items.map(x => x.productId).filter(id => mongoose.isValidObjectId(id));
  if (ids.length !== items.length) return res.status(400).json({ message: 'Invalid product in cart' });
  const products = await Product.find({ _id: { $in: ids }, active: true });
  if (products.length !== new Set(ids).size) return res.status(400).json({ message: 'One or more products are unavailable' });
  const tenantIds = [...new Set(products.map(p => p.tenantId.toString()))];
  if (tenantIds.length !== 1) return res.status(400).json({ message: 'Checkout must contain products from one store' });
  const productMap = new Map(products.map(p => [p._id.toString(), p]));
  const quantities = new Map();
  for (const item of items) {
    const quantity = Number(item.quantity);
    if (!Number.isInteger(quantity) || quantity < 1) return res.status(400).json({ message: 'Invalid quantity' });
    quantities.set(item.productId, (quantities.get(item.productId) || 0) + quantity);
  }
  let total = 0;
  const normalized = [];
  for (const [productId, quantity] of quantities) {
    const p = productMap.get(productId);
    if (!p) return res.status(400).json({ message: 'One or more products are unavailable' });
    if (p.stock < quantity) return res.status(400).json({ message: `${p.name} has only ${p.stock} left` });
    total += p.price * quantity;
    normalized.push({ productId: p._id, name: p.name, quantity, price: p.price });
  }
  const order = await Order.create({ tenantId: products[0].tenantId, customerId: req.user._id, items: normalized, total, shipping, status: 'pending', paymentStatus: 'unpaid' });
  res.status(201).json({ order });
};

export const mine = async (req, res) => {
  const orders = await Order.find({ customerId: req.user._id }).populate('tenantId', 'name slug').sort({ createdAt: -1 });
  res.json({ orders });
};

export const vendorOrders = async (req, res) => {
  const orders = await Order.find({ tenantId: req.user.tenantId }).populate('customerId', 'fullName email phone').sort({ createdAt: -1 });
  res.json({ orders });
};

export const updateOrderStatus = async (req, res) => {
  const allowed = ['pending','paid','processing','shipped','delivered','cancelled'];
  if (!allowed.includes(req.body.status)) return res.status(400).json({ message: 'Invalid status' });
  const order = await Order.findOneAndUpdate({ _id: req.params.id, tenantId: req.user.tenantId }, { status: req.body.status }, { new: true });
  if (!order) return res.status(404).json({ message: 'Order not found' });
  if (order.status === 'paid') await notify(order);
  res.json({ order });
};

export const paymentCompleted = async (orderId, paymentIntentId) => {
  const order = await Order.findById(orderId);
  if (!order || order.paymentStatus === 'paid') return order;
  const updatedProducts = await Product.bulkWrite(order.items.map(item => ({ updateOne: { filter: { _id: item.productId, stock: { $gte: item.quantity } }, update: { $inc: { stock: -item.quantity } } } })));
  if (updatedProducts.modifiedCount !== order.items.length) return null;
  order.paymentStatus = 'paid';
  order.status = 'paid';
  order.stripePaymentIntentId = paymentIntentId || order.stripePaymentIntentId;
  await order.save();
  await notify(order);
  return order;
};

export const adminOrders = async (req, res) => {
  const orders = await Order.find().populate('tenantId', 'name slug').populate('customerId', 'fullName email').sort({ createdAt: -1 }).limit(100);
  res.json({ orders });
};
