import { Router } from 'express';
import { auth, requireRole } from '../utils/auth.js';
import { stripe } from '../services/integrations.js';
import Order from '../models/Order.js';
import { paymentCompleted } from '../controllers/orderController.js';
const router = Router();
router.post('/create-intent', auth, requireRole('customer'), async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.body.orderId, customerId: req.user._id, paymentStatus: 'unpaid' });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (!stripe) return res.json({ configured: false, order });
    const intent = await stripe.paymentIntents.create({ amount: Math.round(order.total * 100), currency: 'inr', metadata: { orderId: order._id.toString() }, automatic_payment_methods: { enabled: true } });
    order.stripePaymentIntentId = intent.id;
    await order.save();
    res.json({ configured: true, clientSecret: intent.client_secret, paymentIntentId: intent.id });
  } catch (e) { res.status(400).json({ message: e.message }); }
});

router.post('/confirm-stripe', auth, requireRole('customer'), async (req, res) => {
  try {
    if (!stripe) return res.status(503).json({ message: 'Stripe is not configured on the server' });
    const order = await Order.findOne({ _id: req.body.orderId, customerId: req.user._id, stripePaymentIntentId: req.body.paymentIntentId });
    if (!order) return res.status(404).json({ message: 'Order or payment reference not found' });
    const intent = await stripe.paymentIntents.retrieve(req.body.paymentIntentId);
    if (intent.status !== 'succeeded' || intent.metadata?.orderId !== order._id.toString()) {
      return res.status(400).json({ message: 'Payment has not been verified as successful' });
    }
    const completed = await paymentCompleted(order._id.toString(), intent.id);
    if (!completed) return res.status(409).json({ message: 'Payment succeeded, but stock could not be reserved. Contact support.' });
    res.json({ order: completed });
  } catch (e) {
    res.status(400).json({ message: e.message || 'Unable to verify payment' });
  }
});

router.post('/confirm-demo', auth, requireRole('customer'), async (req, res) => {
  const order = await paymentCompleted(req.body.orderId, 'demo');
  if (!order) return res.status(400).json({ message: 'Payment could not be completed because stock changed' });
  res.json({ order });
});
export default router;
