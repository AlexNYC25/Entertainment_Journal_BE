let express = require('express');
let router = express.Router();

let Users = require('../models/user');

/*
    Route to remove a tv show from the user's watch list
    POST /removeFromWatchlist/tvShow
    Body: {
        tvShowId: <String>,
        userEmail: <String>
    }
*/
router.post('/tvShow', function(req, res) {
    let userEmail = req.body.userEmail.toLowerCase();
    let tvShowId = req.body.tvShowId;

    Users.findOne({email: userEmail}, function(err, user) {
        if(err) {
            return res.status(500).json({status:"error", message:"Internal Service Error"})
        } 

        if(!user) {
            return res.status(404).json({status:"error", message:"No user found"})
        }

        if(!user.tvShowWatchlist.includes(tvShowId)){
            return res.status(400).json({status:"error", message:"Tv show is not in the watchlist"})
        }

        user.tvShowWatchlist = user.tvShowWatchlist.filter(function(tvShow) {
            return tvShow != tvShowId;
        });
    
        user.save(function(err, user) {
            if(err) {
                return res.status(500).json({status:"error", message:"Error saving user document"})
            }
            return res.status(200).json({status:"success", message:"Tv Show removed from watchlist"})
        });
    });
});


/*
    Route to remove a movie from the user's watch list
    POST /removeFromWatchlist/movie
    Body: {
        movieId: <String>,
        userEmail: <String>
    }
*/
router.post('/movie', function(req, res) {
    let userEmail = req.body.userEmail.toLowerCase();
    let movieId = req.body.movieId;

    Users.findOne({email: userEmail}, function(err, user) {
        if(err) {
            return res.status(500).json({status:"error", message:"Internal Service Error"})
        }

        if(!user) {
            return res.status(404).json({status:"error", message:"User not found"})
        }

        if(!user.movieWatchlist.includes(movieId)){
            return res.status(400).json({status: "error", message: "Movie is not in movie watchlist"})
        }

        user.movieWatchlist = user.movieWatchlist.filter(function(movie) {
            return movie !== movieId;
        });

        user.save(function(err, user) {
            if(err) {
                return res.status(500).json({status:"error", message:"Error saving user document"})
            }

            return res.status(200).json({status:"success", message:"Movie removed from watchlist"})
        });
    });
});


module.exports = router;
