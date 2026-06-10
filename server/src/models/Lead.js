const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    trim: true,
    default: '',
  },
  source: {
    type: String,
    enum: ['website', 'referral', 'social_media', 'email_campaign', 'other'],
    default: 'website',
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'converted', 'closed'],
    default: 'new',
  },
  notes: [{
    content: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
}, { timestamps: true });

module.exports = mongoose.model('Lead', leadSchema);
