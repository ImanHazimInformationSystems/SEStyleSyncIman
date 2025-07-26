const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the public folder (CSS, JS, images)
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));

// HTML Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'signup.html'));
});

app.get('/index.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/signup.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'signup.html'));
});

app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/forgot-password.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'forgot-password.html'));
});

app.get('/reset-password.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'reset-password.html'));
});

app.get('/product-details.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'product-details.html'));
});

// Admin product management page
app.get('/admin/products.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'admin', 'products.html'));
});

app.get('admin/products.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'products.html'));
});

// Admin route
app.get('/admin/index.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'admin', 'index.html'));
});

app.get('/admin/products.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'admin', 'products.html'));
});



// Admin product management page
app.get('/admin/products.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'admin', 'products.html'));
});

app.get('admin/products.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'products.html'));
});



app.get('/about-us.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'about-us.html'));
}); 

app.get('/cart.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'cart.html'));
});

app.get('/checkout.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'checkout.html'));
});

app.get('/trackOrder.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'trackOrder.html'));
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Start Server
app.listen(5000, () => console.log('Server running at http://localhost:5000'));
