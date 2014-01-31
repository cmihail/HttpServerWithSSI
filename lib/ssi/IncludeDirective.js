/**
 * Requires.
 */
var util = require('util');
var path = require('path');
var fs = require('fs');
var winston = require('winston');
var Directive = require('./Directive');

/**
 * Exports.
 */
module.exports = IncludeDirective;
util.inherits(IncludeDirective, Directive);

function IncludeDirective(directive, parameters, serverPath) {
	this.directive = directive;
	this.parameters = parameters;
	this.serverPath = serverPath;
};

/**
 * @Override Directive.process().
 * See http://en.wikipedia.org/wiki/Server_Side_Includes;
 */
IncludeDirective.prototype.process = function(onEndCallback) {
	if (this.parameters.file === undefined ||
			invalidPath(this.parameters.file)) {
		onEndCallback('');
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

function invalidPath(path) {
	if (path.length == 0)
		return true;
	if (path.charAt(0) == '/')
		return true;
	if (path.indexOf('..') != -1)
		return true;
	return false;
};
