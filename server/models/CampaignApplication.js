const mongoose = require('mongoose');

const CampaignApplicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  goal: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    default: null
  },
  payoutName: {
    type: String,
    default: null
  },
  payoutAccount: {
    type: String,
    default: null
  },
  payoutIFSC: {
    type: String,
    default: null
  },
  payoutUPI: {
    type: String,
    default: null
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  paymentId: {
    type: String,
    default: null
  },
  amountPaid: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  adminNotes: {
    type: String,
    default: ''
  }
});

module.exports = mongoose.model('CampaignApplication', CampaignApplicationSchema); 