let express = require('express');
let router = express.Router();

let User = require('../models/user');

/*
    Route to remove a favorite from the user's favorites tv show list
    POST: /removeFavorite/favoriteTvShow
    Body: {
        userEmail: <string>,
        tvShowId: <string>
    }
*/
router.post('/favoriteTvShow', (req, res) => {
    let userEmail = req.body.userEmail.toLowerCase();
    let tvShowId = Number.parseInt(req.body.tvShowId);

    User.findOne({email: userEmail}, (err, user) => {
        if(err){
            return res.status(500).json({status: 'error', message: 'Internal server error.'});
        }
        
        if(!user){
            return res.status(400).json({status: 'error', message: 'User not found.'});
        }

        if(!user.favoriteTvShows.includes(tvShowId)){
            return res.status(400).json({status:'error', message: 'Tv show is not in favorites list.'})
        }

        // filters out the tvShow id that is the one being targeted for removal
        user.favoriteTvShows = user.favoriteTvShows.filter((tvShow) => {
            return tvShow !== tvShowId;
        })

        user.save((err, user) => {
            if(err){
                return res.status(500).json({status: 'error', message: 'Internal server error'});
            }

            return res.status(200).json({status: 'success', message: 'Favorite removed'});
        });
    })
});

/*  
    Route to remove a favorite from the user's favorites movie list
    POST: /removeFavorite/favoriteMovie
    Body: {
        userEmail: <string>,
        movieId: <string>
    }
*/
router.post('/favoriteMovie', (req, res) => {
    let userEmail = req.body.userEmail.toLowerCase();
    let movieId = Number.parseInt(req.body.movieId);

    User.findOne({email: userEmail}, (err, user) => {
        if(err){
            return res.status(500).json({status: 'error', message: 'Internal server error'});
        }
        
        if(!user){
            return res.status(400).json({status: 'error', message: 'User not found'});
        }

        if(!user.favoriteMovies.includes(movieId)){
            return res.status(400).json({status: 'error', message: 'Movie is not in favorites list'});
        }

        user.favoriteMovies = user.favoriteMovies.filter((movie) => {
            return movie !== movieId;
        })

        user.save((err, user) => {
            if(err){
                return res.status(500).json({status: 'error', message: 'Internal server error'});
            }

            return res.status(200).json({status: 'success', message: 'Favorite removed'});
        });
    })
});

module.exports = router;    // Exports the router