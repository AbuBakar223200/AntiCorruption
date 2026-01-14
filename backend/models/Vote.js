const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  reportId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Report',
    required: true
  },
  deviceHash: {
    type: String,
    required: true,
    index: true // Important for lookups
  },
  voteType: {
    type: String,
    enum: ['true', 'false'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to ensure one vote per device per report
voteSchema.index({ reportId: 1, deviceHash: 1 }, { unique: true });

module.exports = mongoose.model('Vote', voteSchema);
