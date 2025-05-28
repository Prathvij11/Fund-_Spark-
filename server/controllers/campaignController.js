const Campaign = require('../models/Campaign');
const Donation = require('../models/Donation');

// Get all campaigns
exports.getAllCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find().sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get single campaign
exports.getCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
    res.json(campaign);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Create campaign
exports.createCampaign = async (req, res) => {
  try {
    const { title, description, goal } = req.body;
    const campaign = new Campaign({ title, description, goal });
    await campaign.save();
    res.status(201).json(campaign);
  } catch (err) {
    res.status(400).json({ error: 'Invalid data' });
  }
};

// Donate to campaign
exports.donateToCampaign = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ error: 'Invalid amount' });
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
    campaign.amountRaised += amount;
    await campaign.save();
    // Create donation record
    const userId = req.user ? req.user.id : null;
    if (userId) {
      await Donation.create({ user: userId, campaign: campaign._id, amount });
    }
    res.json(campaign);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete campaign (admin only)
exports.deleteCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndDelete(req.params.id);
    if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
    res.json({ message: 'Campaign deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}; 