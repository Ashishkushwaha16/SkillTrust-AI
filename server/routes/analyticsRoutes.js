const express = require('express');
const {
  getTrustScore,
  getSkillsAnalytics,
  getActivityTimeline,
  getDashboardAnalytics
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

const router = express.Router();

/**
 * @route   GET /api/analytics/score
 * @desc    Get trust score breakdown
 * @access  Private
 */
router.get('/score', protect, getTrustScore);

/**
 * @route   GET /api/analytics/skills
 * @desc    Get skills analytics
 * @access  Private
 */
router.get('/skills', protect, getSkillsAnalytics);

/**
 * @route   GET /api/analytics/activity
 * @desc    Get activity timeline
 * @access  Private
 */
router.get('/activity', protect, getActivityTimeline);

/**
 * @route   GET /api/analytics/dashboard
 * @desc    Get dashboard analytics
 * @access  Private
 */
router.get('/dashboard', protect, getDashboardAnalytics);

module.exports = router;
