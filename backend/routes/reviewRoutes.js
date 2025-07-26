const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const reviewController = require('../controllers/reviewController');

router.post('/:id', protect, reviewController.createReview); // ✅ both must be functions
router.get('/:id', reviewController.getReviewsByProduct);    // optional

module.exports = router;
