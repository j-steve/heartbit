var router = require('express').Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('info');
});

module.exports = router;
