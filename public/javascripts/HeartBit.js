/**** Length of time to look at.
 * From fitbit documentation values are 
 * 1d, 7d, 30d, 1w, 1m, 3m, 6m, 1y, max.
*/
var period = "30d";

var CLIENT_ID = '229V8L';

/**
 * Key of ScriptProperty for Firtbit consumer key.
 * @type {String}
 * @const
 */
var CONSUMER_KEY_PROPERTY_NAME = "17d650e725d6201ff372d59ec78a9165";

/**
 * Key of ScriptProperty for Fitbit consumer secret.
 * @type {String}
 * @const
 */
var CONSUMER_SECRET_PROPERTY_NAME = "a98c6b0947969f65d4e033f3576e2142";

var AUTH_TOKEN = btoa(CLIENT_ID + ':' + CONSUMER_SECRET_PROPERTY_NAME);

function auth() {

	var oAuthData = {
		client_id: CLIENT_ID,
		response_type: 'code',
		scope: 'heartrate',
		redirect_uri: 'http://www.google.com',
		expires_in: 2592000
	};

	var authWindow = window.open('https://www.fitbit.com/oauth2/authorize?' + $.param(oAuthData));
	var t = setInterval(function() {

	}, 1000);
}
function tokenize() {
	$.ajax({
		type: 'POST',
		url: 'https://api.fitbit.com/oauth2/token',
		headers: {'Authorization': 'Basic ' + AUTH_TOKEN},
		data: {
			client_id: CLIENT_ID,
			grant_type: 'authorization_code',
			code: $('#auth-code').val(),
			redirect_uri: 'http://www.google.com'
		},
		complete: function(response, status) {
			$('#response-status').text(status);
			//$('#response').text(JSON.stringify(response, null, 2));
			$('#response').text(JSON.stringify(response.responseJSON, null, 2));
			if (status === 'success') {
				getHeartRate(response.responseJSON.access_token);
			}
		}
	});
}

function getHeartRate(bearerAuth) {
	var targetDate = new Date();
	targetDate.setDate(targetDate.getDate()-5);
	var dateStr = targetDate.toISOString().substr(0, 10);
	$.ajax({
		type: 'GET',
		url: 'https://api.fitbit.com/1/user/-/activities/heart/date/' + dateStr + '/1d/1sec.json',
		headers: {'Authorization': 'Bearer  ' + bearerAuth},
		complete: function(response, status) {
			$('#heartrate-status').text(status);
			//$('#response').text(JSON.stringify(response, null, 2));
			$('#heartrate').text(JSON.stringify(response.responseJSON, null, 2));
		}
	});
}