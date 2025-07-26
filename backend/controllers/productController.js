const Product = require('../models/Product');

// GET all products (public)
exports.getAllProducts = async (req, res) => {
  const products = await Product.find({ isDeleted: false });
  res.json(products);
};

// GET product by ID (public)
exports.getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product || product.isDeleted) return res.status(404).json({ message: 'Not found' });
  res.json(product);
};

// POST new product (admin)
exports.addProduct = async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.status(201).json(product);
};

// PUT edit product (admin)
exports.updateProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(product);
};

// DELETE (soft) product (admin)
exports.softDeleteProduct = async (req, res) => {
  await Product.findByIdAndUpdate(req.params.id, { isDeleted: true });
  res.json({ message: 'Product soft-deleted' });
};
