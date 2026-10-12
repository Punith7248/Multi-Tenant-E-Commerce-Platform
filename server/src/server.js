import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import paymentRoutes from './routes/payments.js';
import mediaRoutes from './routes/media.js';
import emailRoutes from './routes/email.js';
import { stripe } from './services/integrations.js';
import { paymentCompleted } from './controllers/orderController.js';

const app = express();
app.use(helmet());
app.use(cors({ origin: env.clientUrl, credentials: true }));
app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  if (!stripe || !env.stripeWebhookSecret) return res.status(400).send('Stripe webhook is not configured');
  try {
    const event = stripe.webhooks.constructEvent(req.body, req.headers['stripe-signature'], env.stripeWebhookSecret);
    if (event.type === 'payment_intent.succeeded') await paymentCompleted(event.data.object.metadata.orderId, event.data.object.id);
    res.json({ received: true });
  } catch (e) { res.status(400).send(`Webhook Error: ${e.message}`); }
});
app.use(express.json({ limit: '15mb' }));
app.use(morgan('dev'));
app.get('/api/health', (req, res) => res.json({ ok: true, service: 'NovaCart API' }));
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/email', emailRoutes);
app.use((err, req, res, next) => { console.error(err); res.status(err.status || 500).json({ message: err.message || 'Server error' }); });
connectDB().then(() => app.listen(env.port, () => console.log(`NovaCart API running on http://localhost:${env.port}`))).catch(err => { console.error('MongoDB connection failed:', err.message); process.exit(1); });
