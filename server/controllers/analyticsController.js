const User = require('../models/User');
const Project = require('../models/Project');
const PeerReview = require('../models/PeerReview');

/**
 * @route   GET /api/analytics/score
 * @desc    Get user's trust score breakdown
 * @access  Private
 */
exports.getTrustScore = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('projects');

    // Calculate score breakdown
    const githubScore = Math.min((user.githubData.totalCommits / 100) * 40, 40);
    const projectScore = Math.min((user.projects.length / 10) * 30, 30);
    const peerScore = (user.peerRating.average / 5) * 30;

    const breakdown = {
      total: user.trustScore,
      github: Math.round(githubScore),
      projects: Math.round(projectScore),
      peer: Math.round(peerScore),
      details: {
        commits: user.githubData.totalCommits,
        repositories: user.githubData.totalRepos,
        projectCount: user.projects.length,
        peerRating: user.peerRating.average,
        reviewCount: user.peerRating.count
      }
    };

    res.status(200).json({
      success: true,
      data: breakdown
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/analytics/skills
 * @desc    Get user's skill breakdown
 * @access  Private
 */
exports.getSkillsAnalytics = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    // Sort skills by level
    const skills = user.skills
      .sort((a, b) => b.level - a.level)
      .map(skill => ({
        name: skill.name,
        level: skill.level,
        verified: skill.verified
      }));

    // Calculate category breakdown
    const categories = {
      verified: skills.filter(s => s.verified).length,
      unverified: skills.filter(s => !s.verified).length,
      total: skills.length
    };

    res.status(200).json({
      success: true,
      data: {
        skills,
        categories
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/analytics/activity
 * @desc    Get user's activity timeline
 * @access  Private
 */
exports.getActivityTimeline = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get recent projects
    const recentProjects = await Project.find({ owner: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title createdAt verificationScore');

    // Get recent reviews received
    const recentReviews = await PeerReview.find({ reviewedUser: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('reviewer', 'name')
      .select('rating feedback createdAt');

    // Get recent reviews given
    const reviewsGiven = await PeerReview.find({ reviewer: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('reviewedUser', 'name')
      .select('rating createdAt');

    // Combine and sort by date
    const timeline = [
      ...recentProjects.map(p => ({
        type: 'project',
        title: p.title,
        date: p.createdAt,
        score: p.verificationScore
      })),
      ...recentReviews.map(r => ({
        type: 'review_received',
        reviewer: r.reviewer.name,
        rating: r.rating,
        date: r.createdAt
      })),
      ...reviewsGiven.map(r => ({
        type: 'review_given',
        reviewedUser: r.reviewedUser.name,
        date: r.createdAt
      }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    res.status(200).json({
      success: true,
      data: timeline
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/analytics/dashboard
 * @desc    Get complete dashboard analytics
 * @access  Private
 */
exports.getDashboardAnalytics = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('projects');

    // Get statistics
    const stats = {
      trustScore: user.trustScore,
      totalProjects: user.projects.length,
      verifiedProjects: user.projects.filter(p => p.verified).length,
      totalSkills: user.skills.length,
      verifiedSkills: user.skills.filter(s => s.verified).length,
      peerRating: user.peerRating.average,
      reviewCount: user.peerRating.count,
      githubCommits: user.githubData.totalCommits,
      githubRepos: user.githubData.totalRepos
    };

    // Get top skills
    const topSkills = user.skills
      .sort((a, b) => b.level - a.level)
      .slice(0, 5);

    // Get recent activity count
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentProjects = await Project.countDocuments({
      owner: user._id,
      createdAt: { $gte: thirtyDaysAgo }
    });

    const recentReviews = await PeerReview.countDocuments({
      reviewedUser: user._id,
      createdAt: { $gte: thirtyDaysAgo }
    });

    res.status(200).json({
      success: true,
      data: {
        stats,
        topSkills,
        recentActivity: {
          projects: recentProjects,
          reviews: recentReviews
        }
      }
    });
  } catch (error) {
    next(error);
  }
};
