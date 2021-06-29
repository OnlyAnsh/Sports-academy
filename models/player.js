const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const playerSchema = new mongoose.Schema({
    email: {
        type: String, required: true
    },
    scores: [
        {
            score: {
                type: Number,
                default: 0
            },
            target: {
                type: Number,
                default: 0
            }
        }],
    date: {
        type: Date,
        default: Date.now()
    }

});

playerSchema.plugin(passportLocalMongoose);
const Player = mongoose.model('Player', playerSchema);

module.exports = Player;