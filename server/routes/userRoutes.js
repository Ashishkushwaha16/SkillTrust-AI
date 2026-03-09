const express = require('express');
const {
  getProfile,
  updateProfile,
  updateSkills,
  getUserById,
  getUsers,
  syncGithubData
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

/**
 * @route   GET /api/users/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/profile', protect, getProfile);

/**
 * @route   PUT /api/users/update
 * @desc    Update user profile
 * @access  Private
 */
router.put('/update', protect, updateProfile);

/**
 * @route   PUT /api/users/skills
 * @desc    Update user skills
 * @access  Private
 */
router.put('/skills', protect, updateSkills);

/**
 * @route   POST /api/users/sync-github
 * @desc    Sync GitHub data
 * @access  Private
 */
router.post('/sync-github', protect, syncGithubData);

/**
 * @route   GET /api/users
 * @desc    Get all users
 * @access  Public
 */
router.get('/', getUsers);

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Public
 */
router.get('/:id', getUserById);

module.exports = router;
