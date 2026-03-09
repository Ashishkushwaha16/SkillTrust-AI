const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config({ path: '../.env' });

// Connect to database
connectDB();

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Root route - API information
app.get('/', (req, res) => {
  res.json({
    message: 'SkillTrust AI - Verified Skill Intelligence Platform API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      users: '/api/users',
      projects: '/api/projects',
      github: '/api/github',
      matching: '/api/match',
      analytics: '/api/analytics',
      reviews: '/api/reviews'
    },
    documentation: 'Visit http://localhost:3000 for the web application'
  });
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/github', require('./routes/githubRoutes'));
app.use('/api/match', require('./routes/matchRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'success', 
    message: 'SkillTrust AI API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});

module.exports = app;
