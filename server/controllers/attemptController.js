const Attempt = require('../models/Attempt');

// @route   GET /api/attempts/:assignmentId
// @access  Private
exports.getAttemptsByAssignment = async (req, res) => {
    try {
        const attempts = await Attempt.find({
            assignmentId: req.params.assignmentId,
            userId: req.user._id
        }).sort({ createdAt: -1 });

        res.json(attempts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch attempts' });
    }
};

// @route   GET /api/attempts/stats
// @access  Private
exports.getUserStats = async (req, res) => {
    try {
        // Find all successful attempts by this user
        const successfulAttempts = await Attempt.find({
            userId: req.user._id,
            isSuccessful: true
        }).populate('assignmentId', 'difficulty');

        // Determine unique assignments solved
        const solvedAssignmentIds = new Set();
        const stats = {
            Easy: 0,
            Medium: 0,
            Hard: 0,
            Total: 0
        };

        successfulAttempts.forEach(attempt => {
            // assignmentId could be null if the assignment was deleted
            if (attempt.assignmentId && !solvedAssignmentIds.has(attempt.assignmentId._id.toString())) {
                solvedAssignmentIds.add(attempt.assignmentId._id.toString());
                stats[attempt.assignmentId.difficulty]++;
                stats.Total++;
            }
        });

        // We also want an array of solved IDs for the UI to show ✅ marks
        res.json({
            stats,
            solvedIds: Array.from(solvedAssignmentIds)
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
};
