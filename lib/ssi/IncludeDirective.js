/**
 * Requires.
 */
var util = require('util');
var path = require('path');
var fs = require('fs');
var winston = require('winston');
var Directive = require('./Directive');

// Both Include and Exec directives have a problem: path is relative to server path
// NOT to local floder

/**
 * Exports.
 */
module.exports = IncludeDirective;
util.inherits(IncludeDirective, Directive);

/**
 * @param parameters The directive parameters.
 * @param serverPath The server path.
 */
function IncludeDirective(parameters, serverPath) {
	this.parameters = parameters;
	this.serverPath = serverPath;
};

/**
 * @Override Directive.process().
 * See http://en.wikipedia.org/wiki/Server_Side_Includes.
 */
IncludeDirective.prototype.process = function(onEndCallback) {
	if (this.parameters.file === undefined ||
			invalidPath(this.parameters.file)) {
		winston.warn("Invalid file parameter: " + this.parameters.file);
		onEndCallback('');
		return;
	}
	
	var filename = path.join(this.serverPath, this.parameters.file);
	fs.readFile(filename, 'binary', function(err, file) {
		if (err) {
			winston.warn("SSI exception: " + err);
			onEndCallback('');
		} else {
			onEndCallback(file);
		}
	});
};

/**
 * @param path The path to test.
 * @returns {Boolean} True if path is invalid.
 */
function invalidPath(path) {
	if (path.length == 0)
		return true;
	if (path.charAt(0) == '/')
		return true;
	if (path.indexOf('..') != -1)
		return true;
	return false;
};
