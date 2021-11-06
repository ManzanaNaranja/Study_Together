var express = require('express');
var router = express.Router();

var study_controller = require('../controllers/studyController');


router.get('/', study_controller.study);
router.get('/:subject', study_controller.start);
router.get('/:subject/stop', study_controller.stop);




module.exports = router;
