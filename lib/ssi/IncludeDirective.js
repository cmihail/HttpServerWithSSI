/**
 * Requires.
 */
var util = require('util');
var Directive = require('./Directive');

/**
 * Exports.
 */
module.exports = IncludeDirective;
util.inherits(IncludeDirective, Directive);

function IncludeDirective(directive, parameters) {
	this.directive = directive;
	this.parameters = parameters;
};

/**
 * @Override Directive.process().
 * See http://en.wikipedia.org/wiki/Server_Side_Includes;
 * @return The result of the include SSI directive.
 */
IncludeDirective.prototype.process = function() {
	return 'TODO'; // TODO
};
