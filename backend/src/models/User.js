import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  passwordHash: { type: String, required: true, select: false },
  phone: { type: String, trim: true, maxlength: 20 },
  role: { type: String, enum: ['farmer', 'buyer', 'admin'], default: 'buyer', index: true },
  buyerType: { type: String, enum: ['consumer', 'retailer', 'wholesaler'], default: 'consumer' },
  address: { line1: String, city: String, state: String, pincode: String },
  profileImage: { url: String, publicId: String },
  verificationStatus: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending', index: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true, toJSON: { transform: (_, ret) => { delete ret.passwordHash; return ret; } } });

userSchema.methods.comparePassword = function (password) { return bcrypt.compare(password, this.passwordHash); };
userSchema.statics.hashPassword = (password) => bcrypt.hash(password, 12);
export default mongoose.model('User', userSchema);
