let express = require('express');
let router = express.Router();

let User = require('../models/user');

/*
    Route to remove a tv show from the user's watchlist
    POST /removeWatchlist/removeTvshow
    Body: {
        userEmail: <string>,
        tvShowId: <string>
    }
*/
router.post('/removeTvshow', (req, res) => {
    // get body paramaeters
    let userEmail = req.body.userEmail.toLowerCase();
    let tvShowId = Number.parseInt(req.body.tvShowId);

    User.findOne({ email: userEmail }, (err, user) => {
        if(err) {
            return res.status(500).json({status: 'error', message: 'Internal Server error' });
        }

        if(!user) {
            return res.status(400).json({status: 'error', message: 'User not found' });
        }

        if(!user.tvShowWatchlist.include(tvShowId)){
            return res.status(400).json({status: 'error', message: 'Tv show is not in the watchlist'})
        }

        if(user.tvShowWatchlist.includes(tvShowId)){
            return user.tvShowWatchlist = user.tvShowWatchlist.filter(id => id !== tvShowId);
        }

        user.tvShowWatchlist = user.tvShowWatchlist.filter((tvShow) => {
            return tvShow !== tvShowId;
        })

        user.save((err, user) => {
            if(err) {
                return res.status(500).json({status: 'error', message: 'Internal Server error' });
            }

            return res.status(200).json({status: 'success', message: 'Tv show removed from watchlist' });
        });
    });
});

/*
    Route to remove a movie from the user's watchlist
    POST /removeWatchlist/removeMovie
    Body: {
        userEmail: <string>,
        movieId: <string>
    }
*/
router.post('/removeMovie', (req, res) => {
    let userEmail = req.body.userEmail.toLowerCase();
    let movieId = Number.parseInt(req.body.movieId);

    User.findOne({ email: userEmail }, (err, user) => {
        if(err) {
            return res.status(500).json({status: 'error', message: 'Internal Server error' });
        }

        if(!user) {
            return res.status(400).json({status: 'error', message: 'User not found' });
        }

        if(!user.movieWatchlist.includes(movieId)){
            return res.status(400).json({status: 'error', message: 'Movie is not in watchlist'});
        }

        user.movieWatchlist = user.movieWatchlist.filter((movie) => {
            return movie !== movieId;
        })

        user.save((err, user) => {
            if(err) {
                return res.status(500).json({status: 'error', message: 'Internal Server error' });
            }

            return res.status(200).json({status: 'success', message: 'Movie removed from watchlist' });
        });
    })
});

module.exports = router;