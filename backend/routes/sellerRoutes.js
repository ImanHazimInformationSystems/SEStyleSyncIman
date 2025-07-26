// backend/routes/sellerRoutes.js

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Product = require('../models/Product');

// GET: Seller's products (assuming you track seller by user ID)
router.get('/', protect, async (req, res) => {
  const products = await Product.find({ seller: req.user._id });
  res.json(products);
});

// POST: Add product
router.post('/', protect, async (req, res) => {
  try {
    const { name, brand, category, description, price, stock } = req.body;
    const videoUrl = req.file ? `/uploads/videos/${req.file.filename}` : null;

    const product = new Product({
      name,
      brand,
      category,
      description,
      price,
      stock,
      imageUrl: videoUrl,
      seller: req.user._id
    });

    await product.save();
    res.status(201).json({ message: "Product added", product });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add product" });
  }
});

module.exports = router;
