const express = require('express');
const router = express.Router();
const campaignController = require('../controllers/campaignController');
const { auth, adminOnly } = require('../middleware/auth');

// Get all campaigns
router.get('/', campaignController.getAllCampaigns);

// Get single campaign
router.get('/:id', campaignController.getCampaign);

// Create campaign (admin only)
router.post('/', auth, adminOnly, campaignController.createCampaign);

// Donate to campaign (authenticated users)
router.post('/:id/donate', auth, campaignController.donateToCampaign);

// Delete campaign (admin only)
router.delete('/:id', auth, adminOnly, campaignController.deleteCampaign);

module.exports = router; 