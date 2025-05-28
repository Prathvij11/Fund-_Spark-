const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { auth } = require('../middleware/auth');

// Register (role can be 'user' or 'admin')
router.post('/register', authController.register);

// Login
router.post('/login', authController.login);

// Get all donations for the authenticated user
router.get('/donations', auth, authController.getUserDonations);

module.exports = router; 