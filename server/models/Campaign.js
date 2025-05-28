const mongoose = require('mongoose');

const CampaignSchema = new mongoose.Schema({
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
  amountRaised: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Campaign', CampaignSchema); 