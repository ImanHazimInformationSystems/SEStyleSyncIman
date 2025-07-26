const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Public
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Admin
router.post('/', productController.addProduct);         // Add product
router.put('/:id', productController.updateProduct);    // Edit product
router.delete('/:id', productController.softDeleteProduct); // Soft delete

module.exports = router;
