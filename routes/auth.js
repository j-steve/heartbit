var express = require('express');
var router = express.Router();
var qs = require('qs');

/* GET home page. */
router.get('/', function(req, res, next) {
	if (!req.query.code) { 
		var fitbitAuthData = qs.stringify({
			client_id: req.cookies.clientId,
			response_type: 'code',
			scope: 'heartrate',
			redirect_uri: 'http://heart-bit.herokuapp.com/auth',
			expires_in: 2592000
		});
		res.redirect('https://www.fitbit.com/oauth2/authorize?' + fitbitAuthData)
	} else { 
		res.cookie('authCode', req.query.code);
		res.redirect('/');
	}
});

module.exports = router;
