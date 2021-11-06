var User = require('../models/user');

// 
exports.study = function(req,res) {
    res.send('NOT IMPLEMENTED: enter a subject to study');
}

exports.start = function(req, res) {
    res.send(`NOT IMPLEMENTED: studying subject: ${req.params.subject}`);
}

exports.stop = function(req,res) {
    res.send(`NOT IMPLEMENTED: STOP studying ${req.params.subject}`);
}