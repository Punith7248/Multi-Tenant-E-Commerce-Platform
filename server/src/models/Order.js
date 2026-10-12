import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: String,
    quantity: { type: Number, min: 1, required: true },
    price: { type: Number, min: 0, required: true }
  }],
  total: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['pending','paid','processing','shipped','delivered','cancelled'], default: 'pending' },
  paymentStatus: { type: String, enum: ['unpaid','paid','failed','refunded'], default: 'unpaid' },
  stripePaymentIntentId: { type: String, default: '' },
  shipping: {
    name: String,
    phone: String,
    address: String,
    city: String,
    pincode: String
  }
}, { timestamps: true });

orderSchema.index({ tenantId: 1, status: 1, createdAt: -1 });
orderSchema.index({ customerId: 1, createdAt: -1 });

export default mongoose.model('Order', orderSchema);
