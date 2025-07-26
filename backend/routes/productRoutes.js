const express = require('express');
const router = express.Router();

const {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  softDeleteProduct
} = require('../controllers/productController');

const { protect, adminOnly } = require('../middleware/authMiddleware');

// Public Routes
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Admin Routes
router.post('/', protect, adminOnly, addProduct);
router.put('/:id', protect, adminOnly, updateProduct);
router.delete('/:id', protect, adminOnly, softDeleteProduct);

module.exports = router;
