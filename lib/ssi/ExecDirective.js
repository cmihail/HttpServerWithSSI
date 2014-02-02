/**
 * Requires.
 */
var util = require('util');
var exec = require('child_process').exec;
var winston = require('winston');
var Directive = require('./Directive');

/**
 * Exports.
 */
module.exports = ExecDirective;
util.inherits(ExecDirective, Directive);

/**
 * @param parameters The directive parameters.
 */
function ExecDirective(parameters) {
	this.parameters = parameters;
};

/**
 * @Override Directive.process().
 * See http://en.wikipedia.org/wiki/Server_Side_Includes.
 * It supports both "cgi" and "cmd", and for any of them it adds
 * first "stdout", and then "stderr". It both parameters are mentioned,
 * only "cgi" is executed. 
 */
ExecDirective.prototype.process = function(onEndCallback) {
	if (this.parameters.cmd === undefined &&
			this.parameters.cgi === undefined) {
		winston.warn("Undefined cmd/cgi parameter.");
		onEndCallback('');
		return;
	}
	
	var cmd = this.parameters.cgi !== undefined ?
			this.parameters.cgi : this.parameters.cmd;
	exec(cmd, function(err, stdout, stderr) {
		onEndCallback(stdout + stderr);
	});
};
