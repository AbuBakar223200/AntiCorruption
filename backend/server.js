const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const reportsRoutes = require('./routes/reports');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: false, // Allow loading images from static folder
}));
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// DB Connection
// DB Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/anticorruption', {
      serverSelectionTimeoutMS: 5000, // Fail after 5 seconds if not connected
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    console.error(`---------------------------------------------------`);
    console.error(`‼ CRITICAL ERROR: Cannot connect to MongoDB.`);
    console.error(`1. Make sure MongoDB Community Server is INSTALLED.`);
    console.error(`2. Make sure the MongoDB Service is RUNNING.`);
    console.error(`   - Windows: Task Manager > Services > MongoDB`);
    console.error(`   - Mac/Linux: 'brew services start mongodb-community' or 'sudo systemctl start mongod'`);
    console.error(`---------------------------------------------------`);
    // process.exit(1); // Keep it running so we don't crash the nodemon loop, but API won't work
  }
};

connectDB();

// Routes
app.use('/api/reports', reportsRoutes);

app.get('/', (req, res) => {
  res.send('AntiCorruption API is running');
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
