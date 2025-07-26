// backend/controllers/reviewController.js

const Review = require('../models/Review');

exports.createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { id: productId } = req.params;
    const userId = req.user.userId;

    const review = await Review.create({
      user: userId,
      product: productId,
      rating,
      comment,
    });

    res.status(201).json(review);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create review" });
  }
};

exports.getReviewsByProduct = async (req, res) => {
  const productId = req.params.id;
  const reviews = await Review.find({ product: productId }).populate('user', 'name');
  res.json(reviews);
};
