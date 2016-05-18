var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('appinfo', { title: 'HeartBit' });
});

router.post('/', function(req, res, next) {
	res.cookie('clientId', req.body.clientId);
	res.cookie('consumerKey', req.body.consumerKey);
	res.cookie('consumerSecret', req.body.consumerSecret);
	res.redirect("/");
});

module.exports = router;
