const mongoose = require('mongoose');
const scoreSchema = new mongoose.Schema({
    score: {
        type: Number,
        default: 0
    },
    target: {
        type: Number,
        default: 0
    }
});
const Score = mongoose.model('Score', scoreSchema);

module.exports = Score;