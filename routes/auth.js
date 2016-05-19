var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	var token = req.query.token_type + ' ' + req.query.access_token;
	res.cookie('authToken', token, {maxAge: req.query.expires_in});
	res.render("auth", {redirectUrl: req.query.state});
});

module.exports = router;
