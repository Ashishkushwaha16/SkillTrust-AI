const express = require('express');
const {
  getMatchedUsers,
  getComplementaryUsers,
  getUsersBySkill,
  calculateMatchScore
} = require('../controllers/matchController');
const { protect } = require('../middleware/auth');

const router = express.Router();

/**
 * @route   GET /api/match/users
 * @desc    Get matched users
 * @access  Private
 */
router.get('/users', protect, getMatchedUsers);

/**
 * @route   GET /api/match/complementary
 * @desc    Get users with complementary skills
 * @access  Private
 */
router.get('/complementary', protect, getComplementaryUsers);

/**
 * @route   GET /api/match/skill/:skillName
 * @desc    Get users by skill
 * @access  Public
 */
router.get('/skill/:skillName', getUsersBySkill);

/**
 * @route   POST /api/match/calculate
 * @desc    Calculate match score
 * @access  Private
 */
router.post('/calculate', protect, calculateMatchScore);

module.exports = router;
