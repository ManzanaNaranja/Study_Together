var User = require('../models/user');
const {body, oneOf, check, validationResult } = require('express-validator');

// invitation to study
exports.join_others = function(req, res) {
    res.send("NOT IMPLEMENTED: 40 people currently studying. <button>join them!</button>")
}

// lists users
exports.user_list = function(req, res) {
    res.send('NOT IMPLEMENTED: list of users');
}

//get detail of specific user
exports.user_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: User detail: ' + req.params.id);
};

exports.login_get = function(req, res) {
    if(req.secret.loggedin == true) {
       res.redirect('/');
       return;
    }
    res.render('login', {title: 'Login'});
}

exports.login_post = [
    body('username').trim().isLength({min: 1}).withMessage('username field is empty').escape(),
    body('password').trim().isLength({min: 1}).withMessage('password field is empty').escape(),
    (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            res.render('login', {title: 'Login', username: req.body.username, errors: errors.array()})
        } else {
            User.find({ username: req.body.username, password: req.body.password})
            .exec(function(err, list_users) {
                if(err) { return next(err)}
                if(list_users.length == 1) {
                  let options = {maxAge: 1000*60*60, httpOnly: true, signed: false, sameSite: true};
                  res.cookie('id', list_users[0]._id, options);
                  res.redirect('/');
                } else {
                  res.render('login', {title: 'Login', username: req.body.username, errors: [{value: '', msg: 'wrong username/password', param: '', location: ''}]});
                }
            })
        }
    }
]

exports.logout_post = function(req, res) {
    res.send("NOT IMPLEMENTED: logout post");
}

exports.signup_get = function(req, res) {
    if(req.secret.loggedin == true) {
        res.redirect('/');
        return;
     }
    res.render('signup', {title: 'Sign Up'});
}

exports.signup_post = function(req, res) {
    res.send("NOT IMPLEMENTED: signup post");
}
