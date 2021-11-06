var User = require('../models/user');

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
    res.send("NOT IMPLEMENTED: login get");
}

exports.login_post = function(req, res) {
    res.send("NOT IMPLEMENTED: login post");
}

exports.logout_post = function(req, res) {
    res.send("NOT IMPLEMENTED: logout post");
}
