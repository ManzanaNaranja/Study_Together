var User = require('../models/user');
const {body, oneOf, check, validationResult } = require('express-validator');

// 
exports.study = function(req,res) {
    res.render('enter_subject.pug', {title: "Study!", data: req.secret});
}

exports.study_post = [
    body('subject').trim().isLength({min: 1}).withMessage('subject is empty').escape(),
    (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            res.render('enter_subject', {title: 'Study!', errors: errors.array(),  data: req.secret})
        } else {
            res.redirect(`/study/${req.body.subject}`)
        }
    }
]
exports.start = function(req, res) {
    let subject = req.params.subject;
    let cookies = req.cookies;
    User.findById(cookies['id'])
        .exec(function(err, results) {
            if(err) results = false;
            if(results) {
                var person = results;
                person.is_studying = true; // CHECK IF USER ALREADY IS STUDYING
                person.start_time_stamp = Date.now();

                User.findByIdAndUpdate(cookies['id'], person, {}, function(err) {
                    if(err) { return next(err); }
                    res.render('now_studying', {subject: subject, data: req.secret})
                })
            } else {
                { return next(err); }
            }
        })
        
}

exports.stop = function(req,res) {
    res.send(`NOT IMPLEMENTED: STOP studying ${req.params.subject}`);
}