
let express = require('express');
let router = express.Router();

let User = require('../models/user');

let isANumber = (str) => {
    return !isNaN(str);
};

router.post('/rateMovie', (req, res) => {
    let movieId = req.body.movieId;
    let liked = req.body.liked;
    let userId = req.user._id;

    if(!isANumber(movieId) || !isANumber(userId) || !isANumber(liked)) {
        res.status(400).json({
            status: "error",
            message: 'Invalid input'
        });
    }

    // Check if the user has the movie in his movies to watch list, if so remove it
    User.updateOne({userId: userId}, {$pull: {moviesToWatch: movieId}}, (err, result) => {
        if(err) {
            res.status(500).json({
                status: "error",
                message: 'Error removing movie from watch list'
            });
        } 

    }).then(() => {
        /*
            added to user list of liked movies, and remove from list of hated movies if the user
            has already rated the movie
        */
        if(liked) {
            
            User.updateOne({userId: userId}, {$push: {likedMovies: movieId}, $pull: {hatedMovies: movieId}}, (err, result) => {
                if(err) {
                    res.status(500).json({
                        status: "error",
                        message: 'Error adding movie to liked movie list'
                    });
                } else {
                    res.status(200).json({
                        status: "success",
                        message: 'Movie added to liked movies'
                    });
                }
            });


        } else {
            /*
                added to user list of hated movies, and remove from list of liked movies if the user
                has already rated the movie
            */
            User.updateOne({userId: userId}, {$push: {hatedMovies: movieId}, $pull: {likedMovies: movieId}}, (err, result) => {
                if(err) {
                    res.status(500).json({
                        status: "error",
                        message: 'Error adding movie to liked movies list'
                    });
                } else {
                    res.status(200).json({
                        status: "success",
                        message: 'Movie added to liked movies'
                    });
                }
            });
        }
    });
    
});

router.post('/rateShow', (req, res) => {
    let showId = req.body.showId;
    let liked = req.body.liked;
    let userId = req.user._id;

    if(!isANumber(showId) || !isANumber(userId) || !isANumber(liked)) {
        res.status(400).json({
            status: "error",
            message: 'Invalid input'
        });
    }

    // Check if the user has the show in his shows to watch list, if so remove it
    User.updateOne({userId: userId}, {$pull: {tvShows: showId}}, (err, result) => {
        if(err) {
            res.status(500).json({
                status: "error",
                message: 'Error removing show from watch list'
            });
        }
    }).then(() => {
        
        if(liked) {
            User.updateOne({userId: userId}, {$push: {likedTvShows: showId}, $pull: {hatedMovies: showId}}, (err, result) => {
                if(err) {
                    res.status(500).json({
                        status: "error",
                        message: 'Error adding show to liked shows list'    
                    });
                } else {
                    res.status(200).json({
                        status: "success",
                        message: 'Show added to liked shows'
                    });
                }
            });
        } else {
            User.updateOne({userId: userId}, {$push: {hatedTvShows: showId}, $pull: {likedTvShows: showId}}, (err, result) => {
                if(err) {
                    res.status(500).json({
                        status: "error",
                        message: 'Error adding show to liked shows list'
                    });
                } else {
                    res.status(200).json({
                        status: "success",
                        message: 'Show added to liked shows'
                    });
                }
            });
        }
    });

});

      

module.exports = router;