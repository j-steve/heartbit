var express = require('express');
var router = express.Router();
var qs = require('qs');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.redirect('heartrate');
});

module.exports = router;
