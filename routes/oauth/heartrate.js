var router = require('express').Router();
var request = require('request');


router.get('/', function(req, res, next) {
	res.render('heartrate');
});

router.post('/', function(req, res, next) {
	var dateStart = req.body.dateStart;
	var options = {
		url: `https://api.fitbit.com/1/user/-/activities/heart/date/${dateStart}/1d/1sec.json`,
		headers: {'Authorization': req.cookies.authToken}
	};
	request.get(options, function(err, response, body) {
		if (err) {return next(err);}
		if (response.statusCode !== 200) {return next(body);}
		res.locals.heartrateData = JSON.stringify(JSON.parse(body), null, 2);
		res.render('heartrate', {dateStart});
	});
});

module.exports = router;
