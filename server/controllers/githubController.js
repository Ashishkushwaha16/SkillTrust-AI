const githubService = require('../services/githubService');
const User = require('../models/User');

/**
 * @route   GET /api/github/repos/:username
 * @desc    Get GitHub repositories for a user
 * @access  Public
 */
exports.getRepositories = async (req, res, next) => {
  try {
    const { username } = req.params;
    
    const repositories = await githubService.getRepositories(username);

    res.status(200).json({
      success: true,
      count: repositories.length,
      data: repositories
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/github/user/:username
 * @desc    Get GitHub user profile
 * @access  Public
 */
exports.getUserProfile = async (req, res, next) => {
  try {
    const { username } = req.params;
    
    const profile = await githubService.getUserProfile(username);

    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/github/stats/:username
 * @desc    Get GitHub user statistics
 * @access  Public
 */
exports.getUserStats = async (req, res, next) => {
  try {
    const { username } = req.params;
    
    const stats = await githubService.getUserStats(username);

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/github/contributions/:username
 * @desc    Get GitHub user contribution activity
 * @access  Public
 */
exports.getContributions = async (req, res, next) => {
  try {
    const { username } = req.params;
    
    const contributions = await githubService.getContributions(username);

    res.status(200).json({
      success: true,
      data: contributions
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/github/languages/:username
 * @desc    Get programming languages used by user
 * @access  Public
 */
exports.getLanguages = async (req, res, next) => {
  try {
    const { username } = req.params;
    
    const languages = await githubService.getLanguageStats(username);

    res.status(200).json({
      success: true,
      data: languages
    });
  } catch (error) {
    next(error);
  }
};
