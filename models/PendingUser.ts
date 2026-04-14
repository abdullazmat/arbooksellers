import mongoose from 'mongoose';

const pendingUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  phone: String,
  verificationOTP: { type: String, required: true },
  verificationOTPExpires: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now, expires: 3600 } // Auto-delete after 1 hour
});

export default mongoose.models.PendingUser || mongoose.model('PendingUser', pendingUserSchema);
