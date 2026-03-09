const User = require('../models/User');
const githubService = require('../services/githubService');

/**
 * @route   GET /api/users/profile
 * @desc    Get user profile
 * @access  Private
 */
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('projects')
      .select('-password');

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/users/update
 * @desc    Update user profile
 * @access  Private
 */
exports.updateProfile = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      bio: req.body.bio,
      location: req.body.location,
      website: req.body.website,
      githubUsername: req.body.githubUsername,
      avatar: req.body.avatar
    };

    // Remove undefined fields
    Object.keys(fieldsToUpdate).forEach(key => 
      fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );

    const user = await User.findByIdAndUpdate(
      req.user.id,
      fieldsToUpdate,
      {
        new: true,
        runValidators: true
      }
    ).select('-password');

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/users/skills
 * @desc    Update user skills
 * @access  Private
 */
exports.updateSkills = async (req, res, next) => {
  try {
    const { skills } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { skills },
      {
        new: true,
        runValidators: true
      }
    ).select('-password');

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Public
 */
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('projects')
      .select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/users
 * @desc    Get all users (with pagination)
 * @access  Public
 */
exports.getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-password')
      .sort({ trustScore: -1 })
      .limit(limit)
      .skip(skip);

    const total = await User.countDocuments();

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: users
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/users/sync-github
 * @desc    Sync user's GitHub data
 * @access  Private
 */
exports.syncGithubData = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user.githubUsername) {
      return res.status(400).json({
        success: false,
        message: 'GitHub username not set'
      });
    }

    // Fetch GitHub data
    const githubData = await githubService.getUserStats(user.githubUsername);
    
    // Update user with GitHub data
    user.githubData = {
      ...githubData,
      lastSynced: new Date()
    };

    // Update skills based on repositories
    const skills = await githubService.extractSkillsFromRepos(user.githubUsername);
    user.skills = skills;

    // Recalculate trust score
    user.calculateTrustScore();

    await user.save();

    res.status(200).json({
      success: true,
      message: 'GitHub data synced successfully',
      data: user
    });
  } catch (error) {
    next(error);
  }
};
