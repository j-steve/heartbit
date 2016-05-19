var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var File = require('./lib/File');
var OAuth = require('./lib/OAuth');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/index'));
app.use('/info',  require('./routes/info'));

app.use('/appinfo',  require('./routes/appinfo'));
app.use('/auth',  require('./routes/auth'));
app.use(OAuth);

app.use('/heartrate',  require('./routes/heartrate'));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
var errLine = /at (?:([^(\/\\]+) \()?(.+):(\d+):(\d+)(?:\))?/g;
app.use(function(err, req, res, next) {
	var match;
	var codeSnippets = [];
	while ((match = errLine.exec(err.stack))) {
		var file = new File(match[2]);
		var snippet = {
			functionName: match[1],
			filePath: file.path,
			fileName: file.name,
			lineNo: match[3] - 1,
			isLib: file.path.indexOf('node_modules') > -1,
			lines: file.existsSync() ? file.readLinesSync() : []
		};
		codeSnippets.push(snippet);
	}	
	res.status(err.status || 500);
	res.render('error', {
		message : err.message || err,
		error : app.get('env') === 'development' ? err : null,
		codeSnippets: codeSnippets
	});
});


module.exports = app;
