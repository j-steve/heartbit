var express = require('express');
var router = express.Router();
var qs = require('qs');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('auth');
});

router.post('/', function(req, res, next) {
	var tokenData = qs.parse(req.body.authTokenData);
	var token = tokenData.token_type + ' ' + tokenData.access_token;
	var maxAgeSecs = 0+tokenData.expires_in;
	res.cookie('authToken', token, {maxAge: maxAgeSecs});
	
	var rdUrl = decodeURIComponent(tokenData.state);
	res.redirect(rdUrl);
});

module.exports = router;
