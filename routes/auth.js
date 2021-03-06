var router = require('express').Router();
var querystring = require('querystring');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('auth');
});

router.post('/', function(req, res, next) {
	var tokenData = querystring.parse(req.body.authTokenData);
	var token = tokenData.token_type + ' ' + tokenData.access_token;
	var maxAgeSecs = 0+tokenData.expires_in;
	res.cookie('authToken', token, {maxAge: maxAgeSecs});
	
	var rdUrl = decodeURIComponent(tokenData.state);
	res.redirect(rdUrl);
});

module.exports = router;
