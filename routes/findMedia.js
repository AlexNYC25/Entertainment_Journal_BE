const { default: axios } = require('axios');
let express = require('express');
let router = express.Router();


router.get('/search/:query', function(req, res, next) {
    let query = req.params.query;

    axios.get(`https://api.themoviedb.org/3/search/${process.env.TMDB_API_KEY}?api_key=${query}&page=1`)
    .then(response => {
        console.log(response);

        return res.json(response.data);
    }).catch(error => {
        console.log(error);

        return res.json(error);
    });

    res.json({
        message: 'Searching for ' + query
    });

});

module.exports = router;