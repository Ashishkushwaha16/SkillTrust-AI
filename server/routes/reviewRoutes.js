const express = require('express');
const {
  createReview,
  getUserReviews,
  getReviewsGiven,
  getReviewsReceived,
  updateReview,
  deleteReview,
  markHelpful
} = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

const router = express.Router();

/**
 * @route   POST /api/reviews
 * @desc    Create a peer review
 * @access  Private
 */
router.post('/', protect, createReview);

/**
 * @route   GET /api/reviews/given
 * @desc    Get reviews given by current user
 * @access  Private
 */
router.get('/given', protect, getReviewsGiven);

/**
 * @route   GET /api/reviews/received
 * @desc    Get reviews received by current user
 * @access  Private
 */
router.get('/received', protect, getReviewsReceived);

/**
 * @route   GET /api/reviews/user/:userId
 * @desc    Get reviews for a user
 * @access  Public
 */
router.get('/user/:userId', getUserReviews);

/**
 * @route   PUT /api/reviews/:id
 * @desc    Update a review
 * @access  Private
 */
router.put('/:id', protect, updateReview);

/**
 * @route   DELETE /api/reviews/:id
 * @desc    Delete a review
 * @access  Private
 */
router.delete('/:id', protect, deleteReview);

/**
 * @route   PUT /api/reviews/:id/helpful
 * @desc    Mark review as helpful
 * @access  Private
 */
router.put('/:id/helpful', protect, markHelpful);

module.exports = router;
