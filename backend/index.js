const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const cartRoutes = require('./routes/cartRoutes');
const sellerRoutes = require('./routes/sellerRoutes');

dotenv.config();
const app = express();

// ----------------------
// MIDDLEWARE
// ----------------------
app.use(cors());
app.use(express.json());

// Static Assets
app.use(express.static(path.join(__dirname, "public"))); // ✅ for CSS, JS, Images
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads'))); // serve uploaded media

// ----------------------
// API ROUTES
// ----------------------
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/cart', cartRoutes);
app.use('/api/seller', sellerRoutes);

// ----------------------
// HTML ROUTES
// ----------------------
const sendView = (file) => path.join(__dirname, 'views', file);

// Default to SIGNUP page
app.get('/', (req, res) => res.sendFile(sendView('signup.html')));

// Public pages
app.get('/index.html', (req, res) => res.sendFile(sendView('index.html')));
app.get('/signup.html', (req, res) => res.sendFile(sendView('signup.html')));
app.get('/login.html', (req, res) => res.sendFile(sendView('login.html')));
app.get('/forgot-password.html', (req, res) => res.sendFile(sendView('forgot-password.html')));
app.get('/reset-password.html', (req, res) => res.sendFile(sendView('reset-password.html')));
app.get('/product-details.html', (req, res) => res.sendFile(sendView('product-details.html')));
app.get('/about-us.html', (req, res) => res.sendFile(sendView('about-us.html')));
app.get('/cart.html', (req, res) => res.sendFile(sendView('cart.html')));
app.get('/checkout.html', (req, res) => res.sendFile(sendView('checkout.html')));
app.get('/trackOrder.html', (req, res) => res.sendFile(sendView('trackOrder.html')));
app.get('/seller.html', (req, res) => res.sendFile(sendView('seller.html')));

// Admin section
const adminView = (file) => path.join(__dirname, 'views/admin', file);
app.get('/admin', (req, res) => res.sendFile(adminView('index.html')));
app.get('/admin/index.html', (req, res) => res.sendFile(adminView('index.html')));
app.get('/admin/products.html', (req, res) => res.sendFile(adminView('products.html')));
app.get('/admin/orders.html', (req, res) => res.sendFile(adminView('orders.html')));
app.get('/admin/users.html', (req, res) => res.sendFile(adminView('users.html')));

// ----------------------
// MONGODB CONNECTION
// ----------------------
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// ----------------------
// START SERVER
// ----------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
