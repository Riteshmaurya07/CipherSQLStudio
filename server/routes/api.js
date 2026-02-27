const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');
const queryController = require('../controllers/queryController');
const hintController = require('../controllers/hintController');
const attemptController = require('../controllers/attemptController');
const authRoutes = require('./auth');
const { protect } = require('../middleware/auth');

router.use('/auth', authRoutes);

// Optional auth for query execution (so anonymous users can still use it, but logged in users get history)
// However, the prompt says "Save Attempts", we'll just check if auth header exists in queryController manually.
// For explicit attempt fetching, use `protect`
router.get('/attempts/stats', protect, attemptController.getUserStats);
router.get('/attempts/:assignmentId', protect, attemptController.getAttemptsByAssignment);

router.get('/assignments', assignmentController.getAssignments);
router.get('/assignments/:id', assignmentController.getAssignmentById);

router.get('/tables/:tableName', queryController.getTableData);

router.post('/query/execute', queryController.executeQuery);
router.post('/hint', hintController.getHint);

module.exports = router;
