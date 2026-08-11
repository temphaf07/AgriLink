import User from '../models/User.js';
import Product from '../models/Product.js';
import Review from '../models/Review.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const storefront = asyncHandler(async (req, res) => {
  const farmer = await User.findOne({ _id: req.params.id, role: 'farmer', isActive: true }).select('name address profileImage verificationStatus createdAt');
  if (!farmer) throw new AppError('Farmer not found.', 404);
  const products = await Product.find({ farmer: farmer.id, status: 'active', verificationStatus: 'verified' }).sort('-createdAt');
  const rating = await Review.aggregate([{ $match: { product: { $in: products.map(product => product._id) } } }, { $group: { _id: null, average: { $avg: '$rating' }, count: { $sum: 1 } } }]);
  res.json({ success: true, farmer, products, stats: { productCount: products.length, averageRating: Number((rating[0]?.average || 0).toFixed(1)), reviewCount: rating[0]?.count || 0 } });
});
