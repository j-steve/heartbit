'use strict';
const router = require('express').Router();
const Promise = require('bluebird');
const DB = require('../../models/DB');

const httpGet = Promise.promisify(require('request').get);

router.get('/', function(req, res, next) {
	const today = getDateOnly(new Date());
	res.render('heartrate', {dateStart:today, dateEnd:today});
});

router.post('/', function(req, res, next) {
	
	const inserts = [];
	let insertCount = 0;
	const curDate = new Date(req.body.dateStart);
	const maxDate = new Date(req.body.dateEnd);
	
	while (curDate <= maxDate) {
		let thisDate = getDateOnly(curDate);
		
		let options = {
			url: `https://api.fitbit.com/1/user/-/activities/heart/date/${thisDate}/1d/1sec.json`,
			headers: {'Authorization': req.cookies.authToken}
		};
		let getReq = httpGet(options).then(function(response) {
			if (response.statusCode !== 200) {
				next(response.body);
			} else {
				const data = JSON.parse(response.body);
				const dataset = data['activities-heart-intraday']['dataset'];
				return processHeartData(dataset, thisDate).tap(x => insertCount += x);
			}
		});
		inserts.push(getReq);
		
		curDate.setDate(curDate.getDate() + 1);
	}
	
	Promise.all(inserts).then(function(result) {
		console.log(`Rendering after ${insertCount} records.`);
		res.locals.dateStart = req.body.dateStart;
		res.locals.dateEnd = req.body.dateEnd; 
		res.locals.heartrateData = `Inserted: ${insertCount} records from ${req.body.dateStart} to ${req.body.dateEnd}.`;
		res.render('heartrate');		
	}).catch(next);
});

function processHeartData(heartData, date) {
	console.log(`Inserting records for ${date}...`);
	const inserts = [];
	for (let heartrate of heartData) {
		let timestamp = date + ' ' + heartrate.time;
		inserts.push([timestamp, heartrate.value]);
	}
	return DB.batchInsert('heartrate', ['timestamp', 'bpm'], inserts);
}

function getDateOnly(date) {
	return date.toISOString().substr(0, 10)
}



module.exports = router;
