let express = require('express');
let router = express.Router();
var bcrypt = require('bcryptjs');

let User = require('../models/user');

// returns boolean if str is a valid email
let verifyEmail = (emailStr) => {
    let email = emailStr.toLowerCase();
    if(email.match(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i)) {
        return true;
    }
    return false;
}

/*
    currently password requirments are:
        - at least 8 characters
        - at least one number
        - at least one uppercase letter
        - at least one lowercase letter
*/
let verifyPassword = (passwordStr) => {
    let password = passwordStr.toString();
    
    passwordRegex = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/);

    return passwordRegex.test(password);
}

/*
    reduced user object to only include the fields that will be returned
*/
let userToReturn = (user) => {
    return {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
    }
}


router.post('/newUser', (req, res) => {
    let newUserEmail = req.body.email;
    let newUserPassword = req.body.password;

    // check if email is valid and if password is valid
    if(verifyEmail(newUserEmail) && verifyPassword(newUserPassword)) {

        // generate salt for password hashing
        bcrypt.genSalt(10, (err, salt) => {
            // hash password
            bcrypt.hash(newUserPassword, salt, (err, hash) => {
                if(err) {
                    // error hashing password
                    return res.status(500).send({status: 'error', message: 'Error trying to encrypt password', error: err});
                }
                else {
                    // create new user using User model
                    User.create({
                        email: newUserEmail,
                        password: hash,
                        firstName: req.body.firstName.toString(),
                        lastName: req.body.lastName.toString()
                    }, (err, user) => {
                        if(err) {
                            // error creating user
                            return res.status(500).send({status: 'error', message: 'Error creating new user', error: err});
                        } else {
                            return res.status(200).send({status: 'success', message: 'New user created', user: userToReturn(user)});
                        }
                    });
                }
            });
        });
    }
    else {
        return res.status(400).send({status: 'error', message: 'Invalid email or password'});
    }

});

module.exports = router;