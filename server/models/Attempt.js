const mongoose = require('mongoose');

const attemptSchema = new mongoose.Schema({
    assignmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assignment',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Optional for backward compatibility or anonymous attempts
    },
    query: {
        type: String,
        required: true
    },
    isSuccessful: {
        type: Boolean,
        default: false
    },
    errorMessage: {
        type: String,
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model('Attempt', attemptSchema);
