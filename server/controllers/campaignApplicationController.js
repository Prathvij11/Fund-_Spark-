const CampaignApplication = require('../models/CampaignApplication');
const Campaign = require('../models/Campaign');
const Razorpay = require('razorpay');
const crypto = require('crypto');

// Razorpay instance (use your test keys or env vars)
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_xxxxxxxx',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'xxxxxxxxxxxxxx'
});

// Create Razorpay order
exports.createOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    const options = {
      amount: Math.round(Number(amount) * 100), // in paise
      currency: 'INR',
      payment_capture: 1
    };
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create order' });
  }
};

// User submits a campaign application
exports.apply = async (req, res) => {
  try {
    const { title, description, goal, payoutName, payoutAccount, payoutIFSC, payoutUPI } = req.body;
    const user = req.user.id;
    let image = null;
    if (req.file) {
      image = req.file.filename;
    }
    const app = new CampaignApplication({
      user, title, description, goal, image,
      payoutName,
      payoutAccount,
      payoutIFSC,
      payoutUPI,
      paymentStatus: 'pending',
      paymentId: null,
      amountPaid: 0
    });
    await app.save();
    res.status(201).json({ message: 'Application submitted' });
  } catch (err) {
    res.status(400).json({ error: 'Invalid data' });
  }
};

// Admin gets all pending applications
exports.getAll = async (req, res) => {
  try {
    const apps = await CampaignApplication.find({ status: 'pending' }).populate('user', 'username');
    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Admin approves an application
exports.approve = async (req, res) => {
  try {
    const app = await CampaignApplication.findById(req.params.id);
    if (!app || app.status !== 'pending') return res.status(404).json({ error: 'Application not found or already processed' });
    app.status = 'approved';
    await app.save();
    // Create campaign (add image if present)
    const campaignData = {
      title: app.title,
      description: app.description,
      goal: app.goal,
      image: app.image,
      payoutName: app.payoutName,
      payoutAccount: app.payoutAccount,
      payoutIFSC: app.payoutIFSC,
      payoutUPI: app.payoutUPI,
      paymentStatus: app.paymentStatus,
      paymentId: app.paymentId,
      amountPaid: app.amountPaid
    };
    const campaign = new Campaign(campaignData);
    await campaign.save();
    res.json({ message: 'Application approved and campaign created' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Admin rejects an application
exports.reject = async (req, res) => {
  try {
    const app = await CampaignApplication.findById(req.params.id);
    if (!app || app.status !== 'pending') return res.status(404).json({ error: 'Application not found or already processed' });
    app.status = 'rejected';
    await app.save();
    res.json({ message: 'Application rejected' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all applications for the logged-in user
exports.getUserApplications = async (req, res) => {
  try {
    const apps = await CampaignApplication.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Update admin notes for an application
exports.updateNotes = async (req, res) => {
  try {
    const { notes } = req.body;
    const app = await CampaignApplication.findById(req.params.id);
    if (!app) return res.status(404).json({ error: 'Application not found' });
    app.adminNotes = notes;
    await app.save();
    res.json({ message: 'Notes updated', adminNotes: app.adminNotes });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}; 