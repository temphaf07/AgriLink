import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true, trim: true, index: 'text', maxlength: 120 },
  description: { type: String, required: true, maxlength: 1200 },
  category: { type: String, required: true, trim: true, index: true },
  price: { type: Number, required: true, min: 0.01 },
  unit: { type: String, required: true, enum: ['kg', 'quintal', 'tonne', 'piece', 'dozen', 'bundle'] },
  availableQuantity: { type: Number, required: true, min: 0 },
  orderedQuantity: { type: Number, default: 0, min: 0 },
  minimumOrderQuantity: { type: Number, default: 1, min: 1 },
  wholesaleEnabled: { type: Boolean, default: false, index: true },
  wholesalePrice: { type: Number, min: 0.01 },
  bulkDiscountTiers: [{ minimumQuantity: { type: Number, min: 1 }, price: { type: Number, min: 0.01 } }],
  harvestDate: Date,
  farmingMethod: { type: String, enum: ['conventional', 'organic', 'natural', 'other'], default: 'conventional', index: true },
  isOrganic: { type: Boolean, default: false, index: true },
  averageRating: { type: Number, default: 0, min: 0, max: 5, index: true },
  reviewCount: { type: Number, default: 0, min: 0 },
  images: [{ url: String, publicId: String }],
  location: { village: String, district: String, state: String },
  verificationStatus: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending', index: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active', index: true }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
productSchema.virtual('inStock').get(function () { return this.availableQuantity > 0 && this.status === 'active'; });
productSchema.index({ farmer: 1, verificationStatus: 1 });
productSchema.index({ category: 1, price: 1 });
productSchema.index({ wholesaleEnabled: 1, isOrganic: 1, farmingMethod: 1 });
export default mongoose.model('Product', productSchema);
