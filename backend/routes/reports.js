const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Report = require('../models/Report');
const Vote = require('../models/Vote');
const mongoose = require('mongoose');

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname.replace(/\\s+/g, '-')}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Images Only!'));
    }
  }
});

// GET /api/reports/categories - Get unique categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Report.distinct('category');
    // Ensure we have an array
    const safeCategories = Array.isArray(categories) ? categories : [];
    res.json(safeCategories.sort());
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/reports/locations - Get unique locations
router.get('/locations', async (req, res) => {
  try {
    const locations = await Report.distinct('location');
    // Ensure we have an array
    const safeLocations = Array.isArray(locations) ? locations : [];
    res.json(safeLocations.sort());
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/reports - List reports with filters and pagination
router.get('/', async (req, res) => {
  try {
    const { location, category, status, page = 1, limit = 10 } = req.query;
    const query = {};

    if (location) query.location = { $regex: location, $options: 'i' };
    if (category) query.category = category;
    if (status) query.status = status;
    else query.status = { $ne: 'Rejected' }; // Default: show all except rejected

    // Get reports
    const reports = await Report.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Report.countDocuments(query);

    // Aggregate votes for these reports (Optional optimization: do this in the query)
    // For MVP, we can map over them or just return basic info. 
    // To show "32 True, 5 False" on the card, we need the counts.
    
    // Efficient way: Aggregation
    const reportIds = reports.map(r => r._id);
    const voteCounts = await Vote.aggregate([
      { $match: { reportId: { $in: reportIds } } },
      {
        $group: {
          _id: { reportId: '$reportId', voteType: '$voteType' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Map votes to reports
    const reportsWithVotes = reports.map(report => {
      const trueVotes = voteCounts.find(v => v._id.reportId.equals(report._id) && v._id.voteType === 'true')?.count || 0;
      const falseVotes = voteCounts.find(v => v._id.reportId.equals(report._id) && v._id.voteType === 'false')?.count || 0;
      const credibility = (trueVotes + falseVotes) > 0 
        ? Math.round((trueVotes / (trueVotes + falseVotes)) * 100) 
        : 0;

      return {
        ...report.toObject(),
        votes: {
          true: trueVotes,
          false: falseVotes,
          credibility
        }
      };
    });

    res.json({
      reports: reportsWithVotes,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/reports - Create a new report
router.post('/', upload.array('images', 3), async (req, res) => {
  try {
    const { title, description, location, category } = req.body;
    let imageUrls = [];

    if (req.files) {
      imageUrls = req.files.map(file => `/uploads/${file.filename}`);
    }

    const newReport = new Report({
      title,
      description,
      location,
      category,
      images: imageUrls
    });

    const savedReport = await newReport.save();
    res.status(201).json(savedReport);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /api/reports/:id - Get single report with details
router.get('/:id', async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ error: 'Report not found' });

    // Get Vote Counts
    const trueVotes = await Vote.countDocuments({ reportId: report._id, voteType: 'true' });
    const falseVotes = await Vote.countDocuments({ reportId: report._id, voteType: 'false' });
    const credibility = (trueVotes + falseVotes) > 0 
        ? Math.round((trueVotes / (trueVotes + falseVotes)) * 100) 
        : 0;

    res.json({
      ...report.toObject(),
      votes: {
        true: trueVotes,
        false: falseVotes,
        credibility
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/reports/:id/vote - Cast a vote
router.post('/:id/vote', async (req, res) => {
  try {
    const { voteType, deviceHash } = req.body;
    const reportId = req.params.id;

    if (!voteType || !deviceHash) {
      return res.status(400).json({ error: 'Missing specific fields' });
    }

    // Upsert vote
    await Vote.findOneAndUpdate(
      { reportId, deviceHash },
      { voteType, createdAt: Date.now() },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Return new counts
    const trueVotes = await Vote.countDocuments({ reportId, voteType: 'true' });
    const falseVotes = await Vote.countDocuments({ reportId, voteType: 'false' });
    const credibility = (trueVotes + falseVotes) > 0 
        ? Math.round((trueVotes / (trueVotes + falseVotes)) * 100) 
        : 0;

    res.json({
      true: trueVotes,
      false: falseVotes,
      credibility
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/reports/:id - Admin Delete (Mock Auth)
router.delete('/:id', async (req, res) => {
  // Simple check - in real app use middleware
  const adminPassword = req.headers['x-admin-password'];
  if (adminPassword !== process.env.ADMIN_PASSWORD && process.env.ADMIN_PASSWORD) {
     return res.status(403).json({ error: 'Unauthorized' });
  }

  try {
    await Report.findByIdAndDelete(req.params.id);
    await Vote.deleteMany({ reportId: req.params.id });
    res.json({ message: 'Report deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
