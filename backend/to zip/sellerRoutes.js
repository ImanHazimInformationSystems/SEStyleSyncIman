const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const { protect } = require("../middleware/authMiddleware");
const Product = require("../models/Product");

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, "..", "public", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// POST: Add new product (by seller)
router.post("/add-product", protect, upload.single("video"), async (req, res) => {
  try {
    const { name, brand, category, description, price, stock } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: "Name and price are required." });
    }

    const videoUrl = req.file ? `/uploads/${req.file.filename}` : "";

    const product = await Product.create({
      name,
      brand,
      category,
      description,
      price,
      stock,
      seller: req.user._id,
      imageUrl: videoUrl, // rename to videoUrl in schema if preferred
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET: Seller's products
router.get("/products", protect, async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id, isDeleted: false });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE: Seller deletes their product
router.delete("/products/:id", protect, async (req, res) => {
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
