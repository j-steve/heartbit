'use strict';
const router = require('express').Router();
const request = require('request');
const DB = require('../../models/DB');

router.get('/', function(req, res, next) {
	res.render('heartrate');
});

router.post('/', function(req, res, next) {
	const dateStart = req.body.dateStart;
	const options = {
		url: `https://api.fitbit.com/1/user/-/activities/heart/date/${dateStart}/1d/1sec.json`,
		headers: {'Authorization': req.cookies.authToken}
	};
	request.get(options, function(err, response, body) {
		if (err) {
			next(err);
		} else if (response.statusCode !== 200) {
			next(body);
		} else {
			const data = JSON.parse(body);
			processHeartData(data['activities-heart-intraday']['dataset']);
			res.render('heartrate', {dateStart, heartrateData: JSON.stringify(data, null, 2)});	
		}
	});
});

function processHeartData(heartData) {
	const inserts = [];
	for (let heartrate of heartData) {
		inserts.push([heartrate.time, heartrate.value]);
	}
	DB.batchInsert('heartrate', ['timestamp', 'bpm'], inserts);
}

module.exports = router;
