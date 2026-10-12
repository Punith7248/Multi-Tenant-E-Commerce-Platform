import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  role: { type: String, enum: ['customer','vendor'], required: true, index: true },
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, default: '' },
  passwordHash: { type: String, required: true },
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', default: null, index: true },
  status: { type: String, enum: ['active','inactive','pending'], default: 'active' },
  businessName: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
