
let express = require('express');
let router = express.Router();

let User = require('../models/user');

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
    Route to add a favorite tv show to the user's favorites
    POST /favorite/favoriteTvShow
    Body: {
        userEmail: <string>,
        tvShowId: <string>
    }
*/
router.post('/favoriteTvShow', (req, res) => {
    let tvShowId = Number.parseInt(req.body.tvShowId);
    let userEmail = req.body.userEmail;

    if(!isANumber(tvShowId)) {
        return res.status(400).json({status: 400, message: 'Invalid tv show id'});
    }

    // check if the tv show id is valid
    validateTvShowId(tvShowId)
        .then(result => {
            if(!result){
                res.status(400).json({status: 400, message: 'Invalid tv show id'});
            }
            else{
                // check database to see if the user exists with the email provided
                User.findOne({email: userEmail}, (err, user) => {
                    // handle database error
                    if(err) {
                        console.log(err);
                        return res.status(500).json({status: 500, message: 'Internal server error'});
                    }

                    // handle user not found
                    if(!user) {
                        return res.status(404).json({status: 400, message: 'User not found'});
                    }

                    // check if the user already has the tv show in thier watchlist and remove it if they do
                    if(user.tvShows.includes(tvShowId)) {
                        user.tvShows = user.tvShows.filter(tvShow => tvShow !== tvShowId);
                    }

                    // add the tv show to the user's favorites
                    if(!user.favoriteTvShows.includes(tvShowId)) {
                        user.favoriteTvShows.push(tvShowId);
                    }

                    user.save((err, user) => {
                        if(err) {
                            console.log(err);
                            return res.status(500).json({status: 500, message: 'Internal server error'});
                        }

                        return res.status(200).json({status: 200, message: 'Successfully added tv show to favorites'});
                    });

                });
            }
        })
        

})

/*
    Route to add a favorite movie to the user's favorites
    POST /favorite/favoriteMovie
    Body: {
        "userId": "",
        "movieId": ""
    }
*/
router.post('/favoriteMovie', (req, res) => {
    let movieId = Number.parseInt(req.body.movieId);
    let userEmail = req.body.email.toString();

    if(!isANumber(movieId)){
        return res.status(400).json({status:'error', message: 'Invalid movie id'});
    }

    validateMovieId(movieId).then(result => {
        if(!result){
            res.status(400).json({status:'error', message: 'Invalid movie id'});
            return;
        }
        else {
            User.findOne({email: userEmail}, (err, user) => {
                if(err){
                    return res.status(500).json({status:'error', message: 'Internal server error'});
                }

                if(!user){
                    return res.status(400).json({status:'error', message: 'User not found'});
                }

                // check if the movie is in the user's watchlist, if so remove it
                if(user.movies.contains(movieId)){
                    user.movies = user.movies.filter(movie => movie !== movieId);
                }
                
                // add the movieId to the users favorite movies, if not already there
                if(!user.favoriteMovies.contains(movieId)){
                    user.favoriteMovies.push(movieId);
                }

                user.save((err, user) => {
                    if(err){
                        return res.status(500).json({status:'error', message: 'Internal server error'});
                    }

                    return res.status(200).json({status:'success', message: 'Movie added to favorites'});
                });
            })
        }
    })

    
});
      

module.exports = router;