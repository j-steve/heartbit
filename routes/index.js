var express = require('express');
var router = express.Router();
var qs = require('qs');

/* GET home page. */
router.get('/', function(req, res, next) {
	if (!req.cookies.clientId || !req.cookies.consumerKey || !req.cookies.consumerSecret) {
		res.redirect('appinfo');
	} else if (!req.cookies.authCode) {
		res.redirect('auth');
	} else if (!req.cookies.token) {
		res.redirect('tokenize');
	} else {
		res.redirect('heartrate');
	}
});

module.exports = router;
