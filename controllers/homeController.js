var User = require('../models/user');
const {body, oneOf, check, validationResult } = require('express-validator');

// invitation to study
exports.join_others = function(req, res) {
    res.render('join_them', {title: 'hi there',  data: req.secret})
}

exports.join_others_post = function(req, res) {
   res.redirect('/study');
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

exports.logout_post = function(req, res, next) {
    let options = {maxAge: -1000, httpOnly: true, signed: false, sameSite: true};
    res.cookie('id', 'none', options);
    res.redirect(req.baseUrl + '/login');
}

exports.signup_get = function(req, res) {
    if(req.secret.loggedin == true) {
        res.redirect('/');
        return;
     }
    res.render('signup', {title: 'Sign Up'});
}

exports.signup_post = [
    body('username').trim().toLowerCase().isLength({ min: 2, max: 100}).withMessage('username must be 2-100 characters long').bail().isAlphanumeric().withMessage('username has non-alphanumeric characters'),
    body('password').trim().toLowerCase().isLength({ min: 2, max: 100}).withMessage('password must be 2-100 characters long'),
    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.render('signup', { title: 'Sign Up', data: req.secret, username: req.body.username, errors: errors.array() });
            return;
        } else {
            var user = new User(
            {
                username: req.body.username,
                password: req.body.password
            });

            User.find({ username: req.body.username})
            .exec(function(err, list_users) {
                if(err) { return next(err)}
                if(list_users.length >= 1) {
                    res.render('signup', {title: 'Sign Up', errors: [{value: '', msg: 'username already exists', param: '', location: ''}]});
                    return;
                } 

                user.save(function(err) {
                    if(err) { return next(err); }
                    res.redirect('/login');
                })
            });
        }
    }


]

