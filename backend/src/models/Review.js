import mongoose from 'mongoose';
const reviewSchema = new mongoose.Schema({ product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, index: true }, buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }, rating: { type: Number, required: true, min: 1, max: 5 }, text: { type: String, required: true, trim: true, minlength: 3, maxlength: 1000 }, verifiedPurchase: { type: Boolean, default: false } }, { timestamps: true });
reviewSchema.index({ product: 1, buyer: 1 }, { unique: true });
export default mongoose.model('Review', reviewSchema);
