const User = require('../models/User');
const matchingService = require('../services/matchingService');

/**
 * @route   GET /api/match/users
 * @desc    Get matched users based on skills
 * @access  Private
 */
exports.getMatchedUsers = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.user.id);

    // Get all users except current user
    const allUsers = await User.find({ 
      _id: { $ne: req.user.id },
      isActive: true
    }).select('-password');

    // Calculate similarity scores
    const matches = matchingService.findMatches(currentUser, allUsers);

    // Sort by similarity score
    matches.sort((a, b) => b.similarityScore - a.similarityScore);

    // Return top 10 matches
    const topMatches = matches.slice(0, parseInt(req.query.limit) || 10);

    res.status(200).json({
      success: true,
      count: topMatches.length,
      data: topMatches
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/match/complementary
 * @desc    Get users with complementary skills
 * @access  Private
 */
exports.getComplementaryUsers = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.user.id);

    // Get all users except current user
    const allUsers = await User.find({ 
      _id: { $ne: req.user.id },
      isActive: true
    }).select('-password');

    // Find complementary matches
    const matches = matchingService.findComplementaryMatches(currentUser, allUsers);

    // Sort by complementary score
    matches.sort((a, b) => b.complementaryScore - a.complementaryScore);

    // Return top 10 matches
    const topMatches = matches.slice(0, parseInt(req.query.limit) || 10);

    res.status(200).json({
      success: true,
      count: topMatches.length,
      data: topMatches
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/match/skill/:skillName
 * @desc    Get users with a specific skill
 * @access  Public
 */
exports.getUsersBySkill = async (req, res, next) => {
  try {
    const { skillName } = req.params;
    const minLevel = parseInt(req.query.minLevel) || 0;

    const users = await User.find({
      'skills.name': { $regex: new RegExp(skillName, 'i') },
      'skills.level': { $gte: minLevel }
    }).select('-password').sort({ trustScore: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/match/calculate
 * @desc    Calculate match score between two users
 * @access  Private
 */
exports.calculateMatchScore = async (req, res, next) => {
  try {
    const { userId } = req.body;

    const currentUser = await User.findById(req.user.id);
    const targetUser = await User.findById(userId);

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const similarityScore = matchingService.calculateCosineSimilarity(
      currentUser.skills,
      targetUser.skills
    );

    const complementaryScore = matchingService.calculateComplementaryScore(
      currentUser.skills,
      targetUser.skills
    );

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: targetUser._id,
          name: targetUser.name,
          email: targetUser.email
        },
        similarityScore,
        complementaryScore,
        overallScore: (similarityScore + complementaryScore) / 2
      }
    });
  } catch (error) {
    next(error);
  }
};
