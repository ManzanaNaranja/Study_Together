var User = require('../models/user');
const {body, oneOf, check, validationResult } = require('express-validator');
const { UnsupportedMediaType } = require('http-errors');

// invitation to study
exports.join_others = function(req, res) {
    res.render('join_them', {title: 'hi there', data: req.secret})
}

exports.join_others_post = function(req, res) {
   res.redirect('/study');
}


// lists users
exports.user_list = function(req, res, next) {
    User.find({}).sort({'total_time_studied': -1})
    .exec(function(err, list_users) {
        if(err) {return next(err) }
        res.render('user_list', {title: 'Guest List', data: req.secret, user_list: list_users})
    })
}

//get detail of specific user
exports.user_detail = function(req, res, next) {
    User.findById(req.params.id)
    .exec(function(err, results) {
        if(err) { return next(err); }
        if(results == null) {
            var err = new Error('User not found');
            err.status = 404;
            return next(err);
        }
        res.render('user_detail', {title: 'User Detail', data: req.secret, user: results})
    })
};

exports.login_get = function(req, res) {
    if(req.secret.loggedin == true) {
       res.redirect('/');
       return;
    }
    res.render('login', {title: 'Login', data: req.secret});
}

exports.login_post = [
    body('username').trim().isLength({min: 1}).withMessage('username field is empty').escape(),
    body('password').trim().isLength({min: 1}).withMessage('password field is empty').escape(),
    (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            res.render('login', {title: 'Login', data: req.secret, username: req.body.username, errors: errors.array()})
        } else {
            User.find({ username: req.body.username, password: req.body.password})
            .exec(function(err, list_users) {
                if(err) { return next(err)}
                if(list_users.length == 1) {
                  let options = {maxAge: 1000*60*60, httpOnly: true, signed: false, sameSite: true};
                  res.cookie('id', list_users[0]._id, options);
                  res.redirect('/');
                } else {
                  res.render('login', {title: 'Login', data: req.secret, username: req.body.username, errors: [{value: '', msg: 'wrong username/password', param: '', location: ''}]});
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
    res.render('signup', {title: 'Sign Up', data: req.secret});
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
                    res.render('signup', {title: 'Sign Up', data: req.secret, errors: [{value: '', msg: 'username already exists', param: '', location: ''}]});
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

