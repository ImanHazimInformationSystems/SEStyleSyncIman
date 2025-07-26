const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const Product = require("../models/Product");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

// POST: Add new product (by seller)
router.post("/add-product", auth, upload.single("video"), async (req, res) => {
  try {
    const { name, brand, category, description, price, stock } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: "Name and price are required." });
    }

    const videoPath = req.file ? `/uploads/${req.file.filename}` : "";

    const product = await Product.create({
      name,
      brand,
      category,
      description,
      price,
      stock,
      seller: req.user._id,
      imageUrl: videoPath,
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET: Seller's products
router.get("/products", auth, async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id, isDeleted: false });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE: Seller deletes their product
router.delete("/products/:id", auth, async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, seller: req.user._id },
      { isDeleted: true }
    );
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
