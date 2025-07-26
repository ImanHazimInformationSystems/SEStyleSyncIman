const express = require('express');
const router = express.Router();
const { getProductWithReviews } = require('../controllers/productController');

router.get('/:id', getProductWithReviews);

module.exports = router;
