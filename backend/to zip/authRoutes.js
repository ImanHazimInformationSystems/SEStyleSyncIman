const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); 
const {
  signup, login, forgotPassword, resetPassword
} = require('../controllers/authController');

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

module.exports = router;
