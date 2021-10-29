let express = require('express');
let router = express.Router();
let axios = require('axios').default;

let User = require('../models/user');

// helper function to check if a string is a valid number
let isANumber = (str) => {
    return !isNaN(str);
};

// async helper function to check if a string is a valid tv show id
let validateTvShowId = (tvShowId) => {
    // call the API to see if the show is actually a tv show
    
    let promise = axios.get(`https://api.themoviedb.org/3/tv/${tvShowId}?api_key=${process.env.TMDB_API_KEY}&language=en-US`)
        .then(response => {
            if(response.status === 200) {
                return true;
            } else {
                return false;
            }        
        })
        .catch(error => {
            // if we recieve an error code from the API then we consider the id to be invalid
            console.log(error.response);
            return false;
        
        })
    
    return promise
    
}

// helper function to check if a string is a valid movie id
let validateMovieId = (movieId) => {
    // call the API to see if the show is actually a movie
    let promise = axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.TMDB_API_KEY}&language=en-US`)
        .then(response => { 
            if (response.status === 200) {
                return true;
            } else {
                return false;
            }
        })
        .catch(error => {
            // if we recieve an error code from the API then we consider the id to be invalid
            console.log(error.response);
            return false;
        });

    return promise;
}   


/*

/*
    Route to add a tv show to the users list of tv shows to watch
    POST: /watchlist/addTvshow
    Body: {
        tvShowId: <string>
        email: <string>
    }

*/
router.post('/addTvshow', (req, res) => {
    let tvShowId = Number.parseInt(req.body.tvShowId);
    let userEmail = req.body.userEmail.toString().toLowerCase();

    // check if the tvShow id is a valid number to being with
    if (!isANumber(tvShowId)) {
        return res.status(400).json({status:'error', message:'Provided id must be a number.'});    
    }

    // check if the tvShow id is a valid tv show id
    validateTvShowId(tvShowId).then(result => {
        if(!result) {
            res.status(400).json({status:'error', message: 'Invalid tv show id.'});
            return;
        }
        else{
            //check database if there is a user account with that email address
            User.findOne({email: userEmail}, (err, user) => {
                // handle database error
                if (err) {
                    return res.status(500).json({status:'error', message: 'Error occured while finding user.'});
                }
                // handle no user found
                if (!user) {
                    return res.status(400).json({status:'error', message: 'User not found.'});
                }

                

                // check if the user already has that tv show in their list
                if (user.tvShowWatchlist.indexOf(tvShowId) !== -1) {
                    return res.status(400).json({status:'error', message:'User already has this given TV Show on thier watch list.'});
                }
                else{
                    // add the tv show to the user's list
                    user.tvShowWatchlist.push(tvShowId);
                    user.save((err, user) => {
                        if (err) {
                            return res.status(400).json({status:'error', message:'Error saving TV Show id to their watch list.'});
                        }
                        else{
                            return res.status(200).json({status:'success', message:'Tv show added to user\'s watch list.'});
                        }
                    });
                }

                
            });
        }
    })

    

});

/*
    Route to add a movie to the users list of movies to watch
    POST: /watchlist/addMovie
    Body: {
        movieId: <string>
        email: <string>
    }
*/
router.post('/addMovie', (req, res) => {
    let movieId = Number.parseInt(req.body.movieId);
    let userEmail = req.body.userEmail.toString();

    // check if the movie id is a valid number to being with
    if (!isANumber(movieId)) {
        return res.status(400).json({status:'error', message:'Provided id must be a number.'});
    }
    
    // check with the api to see if the movie id is valid
    validateMovieId(movieId).then(result => {
        if(!result) {
            res.status(400).json({status:'error', message: 'Invalid movie id.'});
            return;
        }
        else{
            //check database if there is a user account with that email address
            User.findOne({email: userEmail}, (err, user) => {
                // handle database error
                if (err) {
                    return res.status(500).json({status:'error', message: 'Error occured while finding user.'});
                }
                // handle no user found
                if (!user) {
                    return res.status(400).json({status:'error', message: 'User not found.'});
                }

                // check if the user already has that movie in their list
                if (user.movieWatchlist.indexOf(movieId) !== -1) {
                    return res.status(400).json({status:'error', message:'User already has this given movie on thier watch list.'});
                }
                else{
                    // add the movie to the user's list
                    user.movieWatchlist.push(movieId);
                    user.save((err, user) => {
                        if (err) {
                            return res.status(400).json({status:'error', message:'Error saving movie id to their watch list.'});
                        }
                        else{
                            return res.status(200).json({status:'success', message:'Movie added to user\'s watch list.'});
                        }
                    });
                }

                
            });
        }
    })
    

});

module.exports = router;