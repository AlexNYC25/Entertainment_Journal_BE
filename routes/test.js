let axios = require('axios').default;


// helper function to check if a string is a valid tv show id
let validateTvShowId = (tvShowId) => {
    // call the API to see if the show is actually a tv show
    
    let promise = axios.get(`https://api.themoviedb.org/3/tv/${tvShowId}?api_key=35278ee18c4e967087391ab37bb56179&language=en-US`)
        .then(response => {
        
            //console.log(response.status)
            if(response.status === 200) {
                return true;
            }        
        })
        .catch(error => {
        // if there is an error, it's not a tv show
            console.log(error.response);
            return false;
        
        })
    
    return promise
    
}

validateTvShowId(12345).then(result => {
    console.log(result)
})

