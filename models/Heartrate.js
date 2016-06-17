'use strict';
const DataCollection = require('./DataCollection');

const Heartrate = new DataCollection('heartbit_data', 'heartrate');

module.exports = Heartrate;