const { default: axios } = require('axios');
let express = require('express');
let router = express.Router();

/*
    Route to find media by a query provided by the user
    GET /search/:query
*/
router.get('/:query', function(req, res, next) {
    let query = req.params.query.toString();

    if(query === 'undefined'){
        return res.send(500).json({
            status: "error",
            message: 'No query provided'
        });
    }

    axios.get(`https://api.themoviedb.org/3/search/multi?api_key=${process.env.TMDB_API_KEY}&language=en-US&query=${query}&page=1&include_adult=false`)
    .then(response => {
        //console.log(response);
        return res.status(200).json({
            status: "success",
            message: 'Searching for ' + query,
            data: response.data
        });

    }).catch(error => {
        console.log(error);
        return res.status(500).json({
            status: "error",
            message: 'Error searching for ' + query,
            error: error
        });

    });
});

/*
    Route to find media by a query provided by the user using a certain page number provided by the user
    GET /search/:query/:page
*/
router.get('/:query/:page', function(req, res, next) {
    let query = req.params.query.toString();
    let page = req.params.page;

    if(query === 'undefined'){
        return res.send(500).json({
            status: "error",
            message: 'No query provided',
            error: 'No query provided'
        });
    }

    if(page === 'undefined'){
        return res.send(500).json({
            message: 'No page provided',
            error: 'No page provided'
        });
    }
    
    axios.get(`https://api.themoviedb.org/3/search/multi?api_key=${process.env.TMDB_API_KEY}&language=en-US&query=${query}&page=${page}&include_adult=false`)
    .then(response => {
        //console.log(response);
        return res.status(200).json({
            status: "success",
            message: 'Searching for ' + query,
            data: response.data
        });
    }).catch(error => {
        console.log(error);
        return res.status(500).json({
            status: "error",
            message: 'Error searching for ' + query,
            error: error
        });
    });
});


module.exports = router;