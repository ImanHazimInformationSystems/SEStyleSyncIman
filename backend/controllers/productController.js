const Product = require('../models/Product');

// GET all products (not deleted)
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ isDeleted: false });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch products: " + err.message });
  }
};

// GET product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product || product.isDeleted) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch product: " + err.message });
  }
};

// CREATE new product
exports.addProduct = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

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
      imageUrl: videoPath
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// UPDATE existing product
exports.updateProduct = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ message: "Failed to update product: " + err.message });
  }
};

// SOFT DELETE product
exports.softDeleteProduct = async (req, res) => {
  try {
    const result = await Product.findByIdAndUpdate(req.params.id, { isDeleted: true });
    if (!result) return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product soft-deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete product: " + err.message });
  }
};
