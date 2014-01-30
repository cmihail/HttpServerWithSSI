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
 * @return Empty string.
 */
InvalidDirective.prototype.process = function() {
	return '';
};
