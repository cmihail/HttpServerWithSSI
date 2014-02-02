/**
 * Requires.
 */
var util = require('util');
var Directive = require('./Directive');

/**
 * Exports.
 */
module.exports = PrintEnvDirective;
util.inherits(PrintEnvDirective, Directive);

function PrintEnvDirective() {
	// Nothing to do.
};

/**
 * @Override Directive.process().
 * See http://en.wikipedia.org/wiki/Server_Side_Includes.
 * Uses ExecDirective directly.
 */
PrintEnvDirective.prototype.process = function(onEndCallback) {
	var result = '';
	for (var attr in process.env) {
		result += attr + '=' + process.env[attr] + '\n';
	}
	onEndCallback(result);
};
