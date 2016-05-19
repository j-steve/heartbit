var express = require('express');
var router = express.Router();
var qs = require('qs');

/* GET home page. */
router.get('/', function(req, res, next) {
	var tokenData = qs.parse(req.body.authTokenData);
	var token = tokenData.token_type + ' ' + tokenData.access_token;
	res.cookie('authToken', token, {maxAge: tokenData.expires_in});
	res.redirect(tokenData.state);
});

module.exports = router;
