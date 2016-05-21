var app = require('express')();
var File = require('si-file');

var ERROR_LINE = /at (?:([^(\/\\]+) \()?(.+):(\d+):(\d+)(?:\))?/g;

module.exports = function(err, req, res, next) {
	console.log('why');
	
	var codeSnippets = [];
	if (err && err.stack) {
		var match;
		while ((match = ERROR_LINE.exec(err.stack))) {
			var file = new File(match[2]);
			var fileExists = file.existsSync();
			var e = {
				functionName: match[1],
				filePath: file.path,
				fileName: file.name,
				lineNo: match[3] - 1,
				colNo: match[4] - 1,
				isLib: true
			};
			if (file.existsSync()) {
				e.isLib = isExternalCode(file);
				e.lines = file.readLinesSync();
				e.targetLine = e.lines[e.lineNo];
				e.beforeErr = e.targetLine.substring(0, e.colNo);
				e.afterErr = e.targetLine.substr(e.colNo);
			}
			codeSnippets.push(e);
		}
	}
	var errMsg =  err ? err.message || err.toString() : '';
	console.error('ERROR: ' + errMsg);
	
	res.status(err && err.status || 500);
	res.render('error', {
		message : errMsg,
		error : err,
		codeSnippets: codeSnippets
	});
};

/**
 * Returns {@code true} if the given file is external (third-party) code,
 * which may be displayed differently than internal app code (e.g. collapsed by default).
 * 
 * @param {File} file
 * @returns {Boolean}
 */
function isExternalCode(file) {
	return file.path.indexOf('node_modules') > -1;
}