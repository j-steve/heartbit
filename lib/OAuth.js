var app = require('express')();
var querystring = require('querystring');

app.use(function(req, res, next) {
	if (!req.cookies.clientId || !req.cookies.consumerKey || !req.cookies.consumerSecret) {
		res.redirect('appinfo');
	} else if (!req.cookies.authToken) { 
		var fitbitAuthData = querystring.stringify({
			client_id: req.cookies.clientId,
			response_type: 'token',
			scope: 'heartrate',
			redirect_uri: req.protocol + '://' + req.get('host') + '/auth',
			expires_in: 2592000,
			state: req.url
		});
		res.redirect('https://www.fitbit.com/oauth2/authorize?' + fitbitAuthData);
	} else {
		next();
	}
});

module.exports = app;
