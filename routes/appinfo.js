var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('appinfo', { title: 'HeartBit' });
});

router.post('/', function(req, res, next) {
	res.send(req.body.clientId);
});

module.exports = router;
