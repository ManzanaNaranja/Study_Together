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
exports.start = function(req, res, next) {
    url = req.baseUrl + req.url;
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
                    res.render('now_studying', {subject: subject, data: req.secret, url: url})
                })
            } else {
                { return next(err); }
            }
    })
        
}

exports.stop = function(req,res) {
    let subject = req.params.subject;
    let cookies = req.cookies;
    var timePassed;
    User.findById(cookies['id'])
        .exec(function(err, results) {
            if(err) results = false;
            if(results) {
                var person = results;
                person.is_studying = false;
                timePassed = Date.now() - person.start_time_stamp;
                person.total_time_studied += timePassed;

                User.findByIdAndUpdate(cookies['id'], person, {}, function(err) {
                    if(err) { return next(err); }
                    res.render('done_studying', {subject: subject, data: req.secret, timePassed: formatMs(timePassed)})
                })
            } else {
                { return next(err); }
            }
    })
}

function formatMs(ms) {
  var totalSeconds = Math.floor(ms / 1000);
  var totalMinutes = Math.floor(totalSeconds / 60);
  var totalHours = Math.floor(totalMinutes / 60);
  return `${totalHours}hrs, ${totalMinutes%60}mins, ${totalSeconds%60}secs`
}