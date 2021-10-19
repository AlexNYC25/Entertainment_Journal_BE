let express = require('express');
let router = express.Router();
let path = require('path');
let axios = require('axios').default;

let User = require('../models/user');


let isANumber = (str) => {
    return !isNaN(str);
};

// returns boolean if str is a valid email
let verifyEmailRegex = (emailStr) => {
    let email = emailStr.toLowerCase();
    if(email.match(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i)) {
        return true;
    }
    return false;
}

// async function to check if there is a valid email account registered in the database
let validateEmail = (email) => {
    let regexResult = verifyEmailRegex(email);

    if(!regexResult) {
        return false;
    }

    let promise = Use.count({email: email}).then(count => {
        if(count === 1) {
            return true;
        }
        return false;
    });

    return promise;
}

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
    POST: /addMedia
    Body: {
        tvShowId: <string>
        email: <string>
    }

*/
router.post('/addTv', (req, res) => {
    let tvShowId = Number.parseInt(req.body.tvShowId);
    let userEmail = req.body.userEmail.toString();

    // check if the tvShow id is a valid number to being with
    if (!isANumber(tvShowId)) {
        return res.status(400).send({status:'error', message:'Provided id must be a number.'});    
    }

    // check if the tvShow id is a valid tv show id
    validateTvShowId(tvShowId).then(result => {
        if(!result) {
            res.status(400).send({status:'error', message: 'Invalid tv show id.'});
            return;
        }
        else{
            //check database if there is a user account with that email address
            User.findOne({email: userEmail}, (err, user) => {
                // handle database error
                if (err) {
                    return res.status(500).send({status:'error', message: 'Error occured while finding user.'});
                }
                // handle no user found
                if (!user) {
                    return res.status(400).send({status:'error', message: 'User not found.'});
                }

                // check if the user already has that tv show in their list
                if (user.tvShows.indexOf(tvShowId) !== -1) {
                    return res.status(400).send({status:'error', message:'User already has this given TV Show on thier watch list.'});
                }
                else{
                    // add the tv show to the user's list
                    user.tvShows.push(tvShowId);
                    user.save((err, user) => {
                        if (err) {
                            return res.status(400).send({status:'error', message:'Error saving TV Show id to their watch list.'});
                        }
                        else{
                            return res.status(200).send({status:'success', message:'Tv show added to user\'s watch list.'});
                        }
                    });
                }

                
            });
        }
    })

    

});

router.post('/addMovie', (req, res) => {
    let movieId = req.body.movieId;
    let userId = req.body.userId;
    // check if the movie id is a valid number to being with
    if (!isANumber(movieId)) {
        return res.status(400).send('Invalid movieId');
    }
    // checks if the user id is a valid number
    if(!isANumber(userId)){
        return res.status(400).send('Invalid userId');
    }
    // check with the api to see if the movie id is valid
    if (!validateMovieId(movieId)) {
        return res.status(400).send('Invalid movieId');
    }
    
    User.updateOne({_id: userId}, {$push: {movies: movieId}}, (err, result) => {
        if (err) {
            return res.status(500).send({status: 'error', message: 'Error adding movie'});
        } else {
            return res.status(200).send({status: 'success', message: 'Movie added'});
        }
    });

});

module.exports = router;