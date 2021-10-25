var express = require('express');
var router = express.Router();
// salt and hash module
let bcrypt = require('bcryptjs')
// mongoose user module
let user = require('../models/user')

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

          return res.status(200)
              .send(
                  {status: 'success', 
                  message: 'User info retrieved', 
                  userInfo: {
                      userEmail: user.email,
                      tvShowWatchlist: user.tvShowWatchlist, 
                      tvShowFavorites: user.tvShowFavorites, 
                      movieWatchlist: user.movieWatchlist, 
                      movieFavorites: user.movieFavorites
                  }});
      });

  });
  
});


module.exports = router;
