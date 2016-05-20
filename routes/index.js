var router = require('express').Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.redirect('o/heartrate');
});

module.exports = router;
