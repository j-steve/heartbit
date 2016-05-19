var router = require('express').Router();
var request = require('request');

/* GET home page. */
router.get('/', function(req, res, next) {
	var targetDate = new Date();
	targetDate.setDate(targetDate.getDate()-5);
	var dateStr = targetDate.toISOString().substr(0, 10);
	var options = {
		url: 'https://api.fitbit.com/1/user/-/activities/heart/date/' + dateStr + '/1d/1sec.json',
		headers: {'Authorization': req.cookies.authToken}
	};
	request.get(options, function(err, response, body) {
		if (err) {return next(err);}
		if (response.statusCode !== 200) {return next(body);}
		res.locals.heartrateData = JSON.stringify(JSON.parse(body), null, 2);
		res.render('heartrate');
	});
	
	
});

module.exports = router;
