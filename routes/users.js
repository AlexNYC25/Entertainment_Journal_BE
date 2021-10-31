var express = require('express');
var router = express.Router();
// salt and hash module
let bcrypt = require('bcryptjs')
// mongoose user module
let user = require('../models/user');
const { response } = require('../app');
let axios = require('axios').default

// async function to get tv show details using tvShowId
let getTvShowInfo = (tvShowId) => {
    let promise = axios.get(`https://api.themoviedb.org/3/tv/${tvShowId}?api_key=${process.env.TMDB_API_KEY}&language=en-US`)
        .then(response => {
            if(response.status === 200){
                //console.log(response.data)
                return response.data;
            }
        })
        .catch(error => {
            console.log(error);
        })

    return promise;
}

// async function to get movie details using movieId
let getMovieInfo = (movieId) => {
    // call the API to see if the show is actually a movie
    let promise = axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.TMDB_API_KEY}&language=en-US`)
        .then(response => { 
            if (response.status === 200) {
                return response.data
            } 
        })
        .catch(error => {
            console.log(error.response);
        });

    return promise;
} 

// function to collect tv show data using an array of tv show ids
let collectTvShowData = async (tvShowArr) => {
    let promiseArr = []
    
    if(!tvShowArr){
        return;
    }

    for(let i = 0; i < tvShowArr.length; i++){
        promiseArr.push(getTvShowInfo(tvShowArr[i]))
    }
    const results = await Promise.all(promiseArr);
    return results;
}

// function to collect movie data using an array of movie ids
let collectMovieData = async (movieArr) => {
    let promiseArr = []

    if(!movieArr){
        return;
    }

    for(let i = 0; i < movieArr.length; i++){
        promiseArr.push(getMovieInfo(movieArr[i]));
    }

    const results = await Promise.all(promiseArr);
    return results;
}

// function to collect all tv and movie details when passsing an object that has properties that are arrays of ids
let collectMediaDetails = async (mediaObjects) => {
    let tvShowWatchlistExpanded = collectTvShowData(mediaObjects.tvShowWatchlist).then((results => {return results}));
    let movieWatchlistExpanded = collectMovieData(mediaObjects.movieWatchlist);

    let tvShowFavoritesExpanded = collectTvShowData(mediaObjects.tvShowFavorites)
    let movieFavoritesExpanded = collectMovieData(mediaObjects.movieFavorites)

    const results_1 = await Promise.all([tvShowWatchlistExpanded, movieWatchlistExpanded, tvShowFavoritesExpanded, movieFavoritesExpanded]);
    return {
        tvShowWatchlist: results_1[0],
        movieWatchlist: results_1[1],
        tvShowFavorites: results_1[2],
        movieFavorites: results_1[3]
    };

}

/*
    Route to get user watchlist and favorites
    POST: /users/watchlistAndFavorites
    Body: {
        userEmail: <string>,
        userPassword: <string>
    }
*/
router.post('/watchlistAndFavorites', (req, res) => {
  let userEmail = req.body.userEmail.toString();
  let userPassword = req.body.userPassword.toString();

  user.findOne({ email: userEmail }, (err, user) => {
      if(err){
          return res.status(500).send({status: 'error', message: 'Error getting info from database'});
      }

      if(!user){
          return res.status(404).send({status: 'error', message: 'User not found'});
      }

      bcrypt.compare(userPassword, user.password, (err, check) => {
        if(err){
            return res.status(500).send({status: 'error', message: 'Error comparing passwords'});
        }

        if(!check){
            return res.status(401).send({status: 'error', message: 'Incorrect password'});
        }

        collectMediaDetails({
            tvShowWatchlist: user.tvShowWatchlist,
            movieWatchlist: user.movieWatchlist,
            tvShowFavorites: user.tvShowFavorites,
            movieFavorites: user.movieFavorites
        })
        .then((results) => {
            console.log(results);

            return res.status(200)
            .json({
                status: 'success',
                message: 'Successfully retrieved watchlist and favorites',
                tvShowWatchlist: results.tvShowWatchlist,
                movieWatchlist: results.movieWatchlist,
                tvShowFavorites: results.tvShowFavorites,
                movieFavorites: results.movieFavorites
            });
        })

               
      });

  });
  
});


module.exports = router;
