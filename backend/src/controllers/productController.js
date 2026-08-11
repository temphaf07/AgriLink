import Product from '../models/Product.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';

const productFields = [
  'name', 'description', 'category', 'price', 'unit', 'availableQuantity',
  'minimumOrderQuantity', 'wholesaleEnabled', 'wholesalePrice',
  'bulkDiscountTiers', 'harvestDate', 'farmingMethod', 'isOrganic',
  'images', 'location', 'status'
];

const pick = (body) => Object.fromEntries(
  Object.entries(body).filter(([key]) => productFields.includes(key))
);

export const listProducts = asyncHandler(async (req, res) => {
  const {
    search, category, minPrice, maxPrice, availability, organic, wholesale,
    farmingMethod, verificationStatus, status, sort = '-createdAt', page = 1,
    limit = 12, mine
  } = req.query;
  const filter = {};

  if (mine === 'true') {
    if (!req.user) throw new AppError('Please sign in to view your products.', 401);
    if (req.user.role !== 'farmer') throw new AppError('Only farmers can view farmer product management data.', 403);
    filter.farmer = req.user.id;

    // Farmer management defaults to active listings. Passing status=inactive is
    // still supported for a future archived-products view.
    if (status && !['active', 'inactive'].includes(status)) {
      throw new AppError('Invalid product status filter.', 422);
    }
    filter.status = status || 'active';
  } else {
    filter.status = 'active';
    filter.verificationStatus = req.user?.role === 'admin' && verificationStatus
      ? verificationStatus
      : 'verified';
  }

  if (search) filter.$text = { $search: search };
  if (category) filter.category = category;
  if (minPrice || maxPrice) {
    filter.price = {
      ...(minPrice && { $gte: Number(minPrice) }),
      ...(maxPrice && { $lte: Number(maxPrice) })
    };
  }
  if (availability === 'in-stock') filter.availableQuantity = { $gt: 0 };
  if (organic === 'true') filter.isOrganic = true;
  if (wholesale === 'true') filter.wholesaleEnabled = true;
  if (farmingMethod) filter.farmingMethod = farmingMethod;
  if (verificationStatus && mine === 'true') filter.verificationStatus = verificationStatus;

  const safeSort = ['price', '-price', 'name', '-createdAt', 'createdAt'].includes(sort)
    ? sort
    : '-createdAt';
  const parsedPage = Math.max(1, Number(page) || 1);
  const parsedLimit = Math.min(100, Math.max(1, Number(limit) || 12));

  const [data, total, categories] = await Promise.all([
    Product.find(filter)
      .populate('farmer', 'name phone address verificationStatus')
      .sort(safeSort)
      .skip((parsedPage - 1) * parsedLimit)
      .limit(parsedLimit),
    Product.countDocuments(filter),
    Product.distinct('category', { status: 'active', verificationStatus: 'verified' })
  ]);

  res.json({
    success: true,
    data,
    categories,
    pagination: { total, page: parsedPage, pages: Math.ceil(total / parsedLimit) }
  });
});

export const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate('farmer', 'name phone address verificationStatus');
  const ownsProduct = product?.farmer?._id.toString() === req.user?.id;
  const canReview = req.user?.role === 'admin';
  if (!product || ((!ownsProduct && !canReview) && (product.status !== 'active' || product.verificationStatus !== 'verified'))) {
    throw new AppError('Product not found.', 404);
  }
  res.json({ success: true, product });
});

export const createProduct = asyncHandler(async (req, res) => {
  const data = pick(req.body);
  if (!data.name || !data.description || !data.category || !data.price || !data.unit || data.availableQuantity === undefined) {
    throw new AppError('Please complete all product fields.', 422);
  }
  const product = await Product.create({ ...data, farmer: req.user.id, verificationStatus: 'pending' });
  res.status(201).json({ success: true, product, message: 'Product submitted for verification.' });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new AppError('Product not found.', 404);
  if (product.farmer.toString() !== req.user.id) throw new AppError('You can only edit your own products.', 403);
  Object.assign(product, pick(req.body));
  product.verificationStatus = 'pending';
  await product.save();
  res.json({ success: true, product, message: 'Product updated and sent for re-verification.' });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new AppError('Product not found.', 404);
  if (product.farmer.toString() !== req.user.id) throw new AppError('You can only remove your own products.', 403);
  product.status = 'inactive';
  await product.save();
  res.json({ success: true, message: 'Product removed from the marketplace.' });
});

export const verifyProduct = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!['pending', 'verified', 'rejected'].includes(status)) throw new AppError('Invalid verification status.', 422);
  const product = await Product.findByIdAndUpdate(req.params.id, { verificationStatus: status }, { new: true });
  if (!product) throw new AppError('Product not found.', 404);
  res.json({ success: true, product });
});
