const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const Cart = require('../models/Cart');

// GET /api/cart
router.get("/", protect, async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
  res.json(cart || { user: req.user._id, items: [] });
});

// Add to cart
router.post('/add', protect, async (req, res) => {
  const { productId, quantity } = req.body;
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = new Cart({ user: req.user._id, items: [] });

  const index = cart.items.findIndex(i => i.product.toString() === productId);
  if (index > -1) {
    cart.items[index].quantity += quantity;
  } else {
    cart.items.push({ product: productId, quantity });
  }

  await cart.save();
  res.json(cart);
});

// Remove from cart
router.delete('/remove/:productId', protect, async (req, res) => {
  const { productId } = req.params;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ message: "Cart not found" });

  cart.items = cart.items.filter(i => i.product.toString() !== productId);
  await cart.save();
  res.json(cart);
});

module.exports = router;
