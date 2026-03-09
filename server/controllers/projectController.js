const Project = require('../models/Project');
const User = require('../models/User');
const githubService = require('../services/githubService');

/**
 * @route   POST /api/projects
 * @desc    Create a new project
 * @access  Private
 */
exports.createProject = async (req, res, next) => {
  try {
    req.body.owner = req.user.id;

    // Fetch GitHub repository data
    const repoData = await githubService.getRepositoryData(req.body.githubRepo);
    
    // Merge repository data with request body
    const projectData = {
      ...req.body,
      stars: repoData.stars,
      forks: repoData.forks,
      primaryLanguage: repoData.language,
      commits: repoData.commits
    };

    const project = await Project.create(projectData);

    // Calculate verification score
    project.calculateVerificationScore();
    await project.save();

    // Add project to user's projects
    await User.findByIdAndUpdate(req.user.id, {
      $push: { projects: project._id }
    });

    // Recalculate user's trust score
    const user = await User.findById(req.user.id);
    user.calculateTrustScore();
    await user.save();

    res.status(201).json({
      success: true,
      data: project
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/projects
 * @desc    Get all projects (with pagination and filters)
 * @access  Public
 */
exports.getProjects = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build query
    let query = {};

    // Filter by verified status
    if (req.query.verified) {
      query.verified = req.query.verified === 'true';
    }

    // Filter by technology
    if (req.query.tech) {
      query.technologies = { $in: [req.query.tech] };
    }

    // Filter by status
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Search by text
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    const projects = await Project.find(query)
      .populate('owner', 'name email githubUsername avatar')
      .populate('contributors.user', 'name email')
      .sort({ verificationScore: -1, createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await Project.countDocuments(query);

    res.status(200).json({
      success: true,
      count: projects.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: projects
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/projects/:id
 * @desc    Get single project
 * @access  Public
 */
exports.getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email githubUsername avatar trustScore')
      .populate('contributors.user', 'name email githubUsername');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/projects/:id
 * @desc    Update project
 * @access  Private (Owner only)
 */
exports.updateProject = async (req, res, next) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check ownership
    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this project'
      });
    }

    project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/projects/:id
 * @desc    Delete project
 * @access  Private (Owner only)
 */
exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check ownership
    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this project'
      });
    }

    await project.deleteOne();

    // Remove from user's projects
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { projects: project._id }
    });

    res.status(200).json({
      success: true,
      data: {},
      message: 'Project deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/projects/user/:userId
 * @desc    Get projects by user
 * @access  Public
 */
exports.getUserProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ owner: req.params.userId })
      .populate('owner', 'name email githubUsername')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    next(error);
  }
};
