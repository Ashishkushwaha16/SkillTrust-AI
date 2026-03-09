const express = require('express');
const {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  getUserProjects
} = require('../controllers/projectController');
const { protect } = require('../middleware/auth');

const router = express.Router();

/**
 * @route   POST /api/projects
 * @desc    Create a new project
 * @access  Private
 */
router.post('/', protect, createProject);

/**
 * @route   GET /api/projects
 * @desc    Get all projects
 * @access  Public
 */
router.get('/', getProjects);

/**
 * @route   GET /api/projects/user/:userId
 * @desc    Get projects by user
 * @access  Public
 */
router.get('/user/:userId', getUserProjects);

/**
 * @route   GET /api/projects/:id
 * @desc    Get single project
 * @access  Public
 */
router.get('/:id', getProject);

/**
 * @route   PUT /api/projects/:id
 * @desc    Update project
 * @access  Private
 */
router.put('/:id', protect, updateProject);

/**
 * @route   DELETE /api/projects/:id
 * @desc    Delete project
 * @access  Private
 */
router.delete('/:id', protect, deleteProject);

module.exports = router;
