var router = require('express').Router();
var querystring = require('querystring');

router.use(function(req, res, next) {
	if (!req.cookies.clientId || !req.cookies.consumerKey || !req.cookies.consumerSecret) {
		res.redirect('/appinfo');
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

<<<<<<< HEAD:lib/OAuth.js
module.exports = app;
=======
router.use('/heartrate', require('./heartrate'));

module.exports = router;
>>>>>>> 931d3f1c3f1bbd01e104fdd4213bc9099c8609d6:routes/oauth/index.js
