import mongoose from 'mongoose';

const tenantSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  slug: { type: String, required: true, unique: true, index: true },
  description: { type: String, default: '' },
  logoUrl: { type: String, default: '' },
  status: { type: String, enum: ['pending','approved','suspended'], default: 'pending', index: true }
}, { timestamps: true });

export default mongoose.model('Tenant', tenantSchema);
