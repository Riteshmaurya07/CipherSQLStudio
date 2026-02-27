const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        required: true
    },
    description: {
        type: String,
        required: true
    },
    expectedResultSchema: {
        type: Array, // Could store expected column names or general shape
        default: []
    },
    sourceTables: [
        {
            name: String,
            columns: [String]
        }
    ],
    setupQuery: {
        type: String,
        required: false
    },
    solutionQuery: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Assignment', assignmentSchema);
