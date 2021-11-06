var User = require('../models/user');

module.exports = function(req, res, next) {
    let cookies = req.cookies;
    if(cookies['id'] == undefined) {
      req.secret = {loggedin: false}
      next();
    } else {
      User.findById(cookies['id'])
        .exec(function(err, results) {
            if(err) results = false;
            if(results) {
                req.secret = {
                    loggedin: true,
                    id: cookies['id'],
                    user: results.username,
                }
                next();
            } else {
                req.secret = {loggedin: false}
                next();
            }
        })
    }  
}