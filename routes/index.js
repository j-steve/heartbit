var express = require('express');
var router = express.Router();
var qs = require('qs');

/* GET home page. */
router.get('/', function(req, res, next) {
	if (!req.cookies.clientId || !req.cookies.consumerKey || !req.cookies.consumerSecret) {
		res.redirect('appinfo');
	} else if (!req.cookies.authCode) {
		var fitbitAuthData = qs.stringify({
			client_id: req.cookies.clientId,
			response_type: 'code',
			scope: 'heartrate',
			redirect_uri: 'http://www.google.com',
			expires_in: 2592000
		});
		res.redirect('https://www.fitbit.com/oauth2/authorize?' + fitbitAuthData);
	} else {
		res.render('index', { title: 'HeartBit' });
	}
});

module.exports = router;
