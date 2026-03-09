const PeerReview = require('../models/PeerReview');
const User = require('../models/User');

/**
 * @route   POST /api/reviews
 * @desc    Create a peer review
 * @access  Private
 */
exports.createReview = async (req, res, next) => {
  try {
    const { reviewedUser, project, rating, feedback, skillsRated } = req.body;

    // Check if user is trying to review themselves
    if (reviewedUser === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot review yourself'
      });
    }

    // Check if reviewed user exists
    const userExists = await User.findById(reviewedUser);
    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: 'Reviewed user not found'
      });
    }

    const review = await PeerReview.create({
      reviewer: req.user.id,
      reviewedUser,
      project,
      rating,
      feedback,
      skillsRated
    });

    await review.populate('reviewer', 'name email avatar');
    await review.populate('reviewedUser', 'name email');

    res.status(201).json({
      success: true,
      data: review
    });
  } catch (error) {
    // Handle duplicate review error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this user for this project'
      });
    }
    next(error);
  }
};

/**
 * @route   GET /api/reviews/user/:userId
 * @desc    Get reviews for a user
 * @access  Public
 */
exports.getUserReviews = async (req, res, next) => {
  try {
    const reviews = await PeerReview.find({ reviewedUser: req.params.userId })
      .populate('reviewer', 'name email avatar githubUsername')
      .populate('project', 'title')
      .sort({ createdAt: -1 });

    const averageRating = reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

    res.status(200).json({
      success: true,
      count: reviews.length,
      averageRating: parseFloat(averageRating.toFixed(2)),
      data: reviews
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/reviews/given
 * @desc    Get reviews given by current user
 * @access  Private
 */
exports.getReviewsGiven = async (req, res, next) => {
  try {
    const reviews = await PeerReview.find({ reviewer: req.user.id })
      .populate('reviewedUser', 'name email avatar')
      .populate('project', 'title')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/reviews/received
 * @desc    Get reviews received by current user
 * @access  Private
 */
exports.getReviewsReceived = async (req, res, next) => {
  try {
    const reviews = await PeerReview.find({ reviewedUser: req.user.id })
      .populate('reviewer', 'name email avatar githubUsername')
      .populate('project', 'title')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/reviews/:id
 * @desc    Update a review
 * @access  Private (Reviewer only)
 */
exports.updateReview = async (req, res, next) => {
  try {
    let review = await PeerReview.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user is the reviewer
    if (review.reviewer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this review'
      });
    }

    review = await PeerReview.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('reviewer', 'name email')
     .populate('reviewedUser', 'name email');

    res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/reviews/:id
 * @desc    Delete a review
 * @access  Private (Reviewer only)
 */
exports.deleteReview = async (req, res, next) => {
  try {
    const review = await PeerReview.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user is the reviewer
    if (review.reviewer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review'
      });
    }

    await review.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
      message: 'Review deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/reviews/:id/helpful
 * @desc    Mark review as helpful
 * @access  Private
 */
exports.markHelpful = async (req, res, next) => {
  try {
    const review = await PeerReview.findByIdAndUpdate(
      req.params.id,
      { $inc: { helpful: 1 } },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
    next(error);
  }
};
