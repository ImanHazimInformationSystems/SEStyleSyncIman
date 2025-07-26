const Review = require('../models/Review');

exports.addReview = async (req, res) => {
  const { rating, comment } = req.body;

  const review = new Review({
    user: req.user.userId,
    product: req.params.productId,
    rating,
    comment,
  });

  await review.save();
  res.status(201).json({ message: "Review submitted" });
};
