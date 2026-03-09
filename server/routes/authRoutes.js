const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validator');
const { 
  register, 
  login, 
  getMe, 
  updatePassword 
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    body('githubUsername')
      .optional()
      .trim()
      .isLength({ min: 1 })
  ],
  validate,
  register
);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  validate,
  login
);

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged in user
 * @access  Private
 */
router.get('/me', protect, getMe);

/**
 * @route   PUT /api/auth/updatepassword
 * @desc    Update password
 * @access  Private
 */
router.put(
  '/updatepassword',
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 6 })
      .withMessage('New password must be at least 6 characters')
  ],
  protect,
  validate,
  updatePassword
);

module.exports = router;
