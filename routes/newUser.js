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

/*
    Route to create a new user
    POST /newUser/register
    Body: {
        newUserEmail: <string>,
        newUserPassword: <string>
    }
*/
router.post('/register', (req, res) => {
    let newUserEmail = req.body.email.toString().toLowerCase();
    let newUserPassword = req.body.password.toString();
    let newUserFirstName = req.body.firstName.toString();
    let newUserLastName = req.body.lastName.toString();

    // check if email is valid and if password is valid
    if(verifyEmail(newUserEmail) && verifyPassword(newUserPassword)) {

        // check if user already exists
        User.findOne({email: newUserEmail}, (err, user) => {
            if(err) {
                res.status(500).json({ error: 'Internal server error' });
                return
            }
            if(user) {
                res.status(400).json({ error: 'User already exists' });
                return
            }
            else{
                // generate salt for password hashing
                bcrypt.genSalt(10, (err, salt) => {
                    // hash password
                    bcrypt.hash(newUserPassword, salt, (err, hash) => {
                        if(err) {
                            // error hashing password
                            return res.status(500).json({status: 'error', message: 'Error trying to encrypt password', error: err});
                        }
                        else {
                            // create new user using User model
                            User.create({
                                email: newUserEmail,
                                password: hash,
                                firstName: newUserFirstName,
                                lastName: newUserLastName
                            }, (err, user) => {
                                if(err) {
                                    // error creating user
                                    return res.status(500).json({status: 'error', message: 'Error creating new user', error: err});
                                } else {
                                    return res.status(200).json({status: 'success', message: 'New user created', user: userToReturn(user)});
                                }
                            });
                        }
                    });
                });
            }
        });

        
    }
    else {
        return res.status(400).json({status: 'error', message: 'Invalid email or password'});
    }

});

module.exports = router;