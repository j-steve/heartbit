var express = require('express');
var router = express.Router();
var request = require('request');
var btoa = require('btoa');

/* GET home page. */
router.get('/', function(req, res, next) {
	var authToken = btoa(req.cookies.clientId + ':' + req.cookies.consumerSecret);
	var options = {
		url: 'https://api.fitbit.com/oauth2/token',
		headers: {'Authorization': 'Basic ' + authToken},
		form: {
			client_id: req.cookies.clientId,
			grant_type: 'authorization_code',
			code: req.cookies.authCode
		}
	};
	request.post(options, function(err, response, body) {
		if (err) {return next(err);}
		if (response.statusCode !== 200) {return next(body);}
		var token = body.token_type + ' ' + body.access_token;
		var expiration = {maxAge: body.expires_in};
		res.cookie('token', token, expiration);
		res.cookie('refreshToken', body.refresh_token, expiration);
		res.redirect('/');
	});
});

module.exports = router;
