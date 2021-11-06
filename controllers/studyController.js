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
    res.send(`NOT IMPLEMENTED: studying subject: ${req.params.subject}`);
}

exports.stop = function(req,res) {
    res.send(`NOT IMPLEMENTED: STOP studying ${req.params.subject}`);
}