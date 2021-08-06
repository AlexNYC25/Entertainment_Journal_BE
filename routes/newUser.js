let express = require('express');
let router = express.Router();
let User = require('../models/user');

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
    let password = this.toString(passwordStr);
    if(password.length >= 8) {
        if(password.count(/[a-z]/) >= 1 && password.count(/[A-Z]/) >= 1 && password.count(/[0-9]/) >= 1) {
            return true;
        }
    }
    return false;
}


router.post('/newUser', (req, res) => {
    let newUserEmail = req.body.email;
    let newUserPassword = req.body.password;

    if(verifyEmail(newUserEmail) && verifyPassword(newUserPassword)) {
        User.create({
            email: newUserEmail,
            password: newUserPassword,
            firstName: req.body.firstName,
            lastName: req.body.lastName
        }, (err, user) => {
            if(err) {
                return res.status(500).send({status: 'error', message: 'Error creating new user'});
            } else {
                return res.status(200).send({status: 'success', message: 'New user created'});
            }
        });
    }
    else {
        return res.status(400).send({status: 'error', message: 'Invalid email or password'});
    }

});

module.exports = router;