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
			code: req.cookies.authCode,
			redirect_uri: 'http://heart-bit.herokuapp.com/auth'
		}
	};
	request.post(options, function(err, response, body) {
		if (err) {return next(err);}
		res.send(JSON.stringify({response: response, body:body}, null, 2));
	});
});

module.exports = router;
