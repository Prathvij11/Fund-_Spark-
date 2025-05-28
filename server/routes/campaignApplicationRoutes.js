const express = require('express');
const router = express.Router();
const controller = require('../controllers/campaignApplicationController');
const { auth, adminOnly } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// User applies for a campaign
router.post('/', auth, upload.single('image'), controller.apply);

// Admin views all pending applications
router.get('/', auth, adminOnly, controller.getAll);

// Admin approves an application
router.post('/:id/approve', auth, adminOnly, controller.approve);

// Admin rejects an application
router.post('/:id/reject', auth, adminOnly, controller.reject);

// Create Razorpay order
router.post('/create-order', auth, controller.createOrder);

// Get all applications for the logged-in user
router.get('/user', auth, controller.getUserApplications);

// Update admin notes for an application
router.patch('/:id/notes', auth, adminOnly, controller.updateNotes);

module.exports = router; 