let express = require('express');
let router = express.Router();
let path = require('path');
let axios = require('axios');

let User = require('../models/user');

let isANumber = (str) => {
    return !isNaN(str);
};


let validateTvShowId = (tvShowId) => {
    axios.get(`https://api.themoviedb.org/3/tv/${tvShowId}?api_key=${process.env.TMDB_API_KEY}`).then(response => {
        if (response.data.status === 'success') {
            return true;
        } else {
            return false;
        }
    }).catch(error => {
        console.log(error);
        return false;
    });

}

let validateMovieId = (movieId) => {
    axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.TMDB_API_KEY}`).then(response => { 
        if (response.data.status === 'success') {
            return true;
        } else {
            return false;
        }

    }).catch(error => {
        console.log(error);
        return false;
    });
}   


router.post('/addTv', (req, res) => {
    let tvShowId = req.body.tvShowId;
    let userId = req.body.userId;

    // check if the tvShow id is a valid number to being with
    if (!isANumber(tvShowId)) {
        return res.status(400).send('Invalid tvShowId');
    }

    // checks if the user id is a valid number
    if(!isANumber(userId)){
        return res.status(400).send('Invalid userId');
    }


    // check with the api to see if the tvShow id is valid
    if (!validateTvShowId(tvShowId)) {
        return res.status(400).send('Invalid tvShowId');
    }


    User.updateOne({_id: userId}, {$push: {tvShows: tvShowId}}, (err, result) => {
        if (err) {
            return res.status(500).send({status: 'error', message: 'Error adding tv show'});
        } else {
            return res.status(200).send({status: 'success', message: 'Tv show added'});
        }
    });



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