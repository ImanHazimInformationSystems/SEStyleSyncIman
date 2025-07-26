const Product = require('../models/Product');
const Review = require('../models/Review');

exports.getProductWithReviews = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });

  const reviews = await Review.find({ product: req.params.id }).populate('user', 'name');
  const avgRating = reviews.length > 0
    ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  res.json({ product, reviews, avgRating });
};
