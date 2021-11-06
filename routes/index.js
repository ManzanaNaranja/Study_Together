var express = require('express');
var router = express.Router();

var home_controller = require('../controllers/homeController');


router.get('/', home_controller.join_others);
router.get('/people', home_controller.user_list);
router.get('/people/:id', home_controller.user_detail);
router.get('/login', home_controller.login_get);
router.post('/login', home_controller.login_post);
router.post('/logout',home_controller.logout_post);
router.get('/signup', home_controller.signup_get);
router.post('/signup',home_controller.signup_post);

module.exports = router;
