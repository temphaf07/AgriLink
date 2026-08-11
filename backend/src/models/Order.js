import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({ product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, name: String, unit: String, price: { type: Number, required: true }, quantity: { type: Number, required: true, min: 1 }, subtotal: { type: Number, required: true } }, { _id: false });
const orderSchema = new mongoose.Schema({
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  items: { type: [itemSchema], required: true },
  totalAmount: { type: Number, required: true },
  commissionAmount: { type: Number, default: 0 },
  deliveryAddress: {
    name: { type: String, trim: true, maxlength: 80 }, phone: { type: String, trim: true, maxlength: 20 },
    line1: { type: String, trim: true, maxlength: 200 }, city: { type: String, trim: true, maxlength: 80 },
    state: { type: String, trim: true, maxlength: 80 }, pincode: { type: String, trim: true, maxlength: 12 }
  },
  paymentStatus: { type: String, enum: ['pending', 'cash_on_delivery', 'paid'], default: 'cash_on_delivery' },
  orderStatus: { type: String, enum: ['pending', 'confirmed', 'processing', 'completed', 'cancelled', 'rejected'], default: 'pending', index: true },
  statusHistory: [{ status: String, note: String, at: { type: Date, default: Date.now } }]
}, { timestamps: true });
orderSchema.index({ buyer: 1, createdAt: -1 }); orderSchema.index({ farmer: 1, createdAt: -1 });
export default mongoose.model('Order', orderSchema);
