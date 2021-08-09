let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let UserSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    tvShows: [Number],
    movies: [Number],
    likedMovies: [Number],
    hatedMoveies: [Number],
    likedTvShows: [Number],
    hatedTvShows: [Number]
});

const User = mongoose.model('User', UserSchema);

module.exports = User;