var router = require('express').Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.locals.clientId = req.cookies.clientId || '229V8L';
	res.locals.consumerKey = req.cookies.consumerKey || '17d650e725d6201ff372d59ec78a9165';
	res.locals.consumerSecret = req.cookies.consumerSecret || 'a98c6b0947969f65d4e033f3576e2142';
	res.render('appinfo', { title: 'HeartBit' });
});

router.post('/', function(req, res, next) {
	res.cookie('clientId', req.body.clientId);
	res.cookie('consumerKey', req.body.consumerKey);
	res.cookie('consumerSecret', req.body.consumerSecret);
	res.redirect("/");
});

module.exports = router;
