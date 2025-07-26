const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: String,
  category: String,
  description: String,
  price: { type: Number, required: true },
  imageUrl: String,
  stock: { type: Number, default: 0 },
  isDeleted: { type: Boolean, default: false }, // Soft delete
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
