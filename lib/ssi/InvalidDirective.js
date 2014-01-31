/**
 * Requires.
 */
var util = require('util');
var Directive = require('./Directive');

/**
 * Exports.
 */
module.exports = InvalidDirective;
util.inherits(InvalidDirective, Directive);

function InvalidDirective() {
	// Nothing to do.
};

/**
 * @Override Directive.process().
 */
InvalidDirective.prototype.process = function(onEndCallback) {
	onEndCallback('');
};
