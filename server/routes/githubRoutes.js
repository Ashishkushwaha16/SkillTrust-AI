const express = require('express');
const {
  getRepositories,
  getUserProfile,
  getUserStats,
  getContributions,
  getLanguages
} = require('../controllers/githubController');

const router = express.Router();

/**
 * @route   GET /api/github/repos/:username
 * @desc    Get GitHub repositories
 * @access  Public
 */
router.get('/repos/:username', getRepositories);

/**
 * @route   GET /api/github/user/:username
 * @desc    Get GitHub user profile
 * @access  Public
 */
router.get('/user/:username', getUserProfile);

/**
 * @route   GET /api/github/stats/:username
 * @desc    Get GitHub user statistics
 * @access  Public
 */
router.get('/stats/:username', getUserStats);

/**
 * @route   GET /api/github/contributions/:username
 * @desc    Get GitHub contributions
 * @access  Public
 */
router.get('/contributions/:username', getContributions);

/**
 * @route   GET /api/github/languages/:username
 * @desc    Get programming languages
 * @access  Public
 */
router.get('/languages/:username', getLanguages);

module.exports = router;
