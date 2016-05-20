var router = require('express').Router();
var querystring = require('querystring');

router.use(function(req, res, next) {
	if (!req.cookies.clientId || !req.cookies.consumerKey || !req.cookies.consumerSecret) {
		res.redirect('appinfo');
	} else if (!req.cookies.authToken) { 
		var fitbitAuthData = querystring.stringify({
			client_id: req.cookies.clientId,
			response_type: 'token',
			scope: 'heartrate',
			redirect_uri: 'http://heart-bit.herokuapp.com/auth',
			expires_in: 2592000,
			state: req.url
		});
		res.redirect('https://www.fitbit.com/oauth2/authorize?' + fitbitAuthData);
	} else {
		next();
	}
});

router.use('/heartrate', require('./heartrate'));

module.exports = router;