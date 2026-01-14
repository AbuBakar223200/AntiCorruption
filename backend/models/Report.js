const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true,
    default: 'Other'
  },
  images: [{
    type: String // URLs to images
  }],
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'], // For moderation
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for votes will be populated manually or via aggregation usually,
// but we can keep it simple first.
// We will store aggregated counts in the response, not necessarily in the DB document permanently 
// unless we want optimization. The requirements said "GET /api/reports/:id to fetch... with aggregated vote counts".
// We can compute on the fly or maintain a counter. Computing on fly is safer for consistency.

module.exports = mongoose.model('Report', reportSchema);
