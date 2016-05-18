var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	if (req.cookies.clientId && !req.cookies.consumerKey && req.cookies.consumerSecret) {
		res.render('index', { title: 'HeartBit' });
	} else {
		res.redirect('appinfo');
	}
});

module.exports = router;
