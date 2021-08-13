let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

let Users = require('../models/user');

router.post('removeFromWatch', function(req, res) {
    let userId = req.user._id;
    let mediaId = req.body.mediaId;

    Users.findOne({_id: userId},{$pull: {tvShows:mediaId}, $pull: {movies: mediaId}}, function(err, user) {
        if(err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(user);
        }
    });
    
});

module.exports = router;
