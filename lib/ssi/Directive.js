/**
 * Exports.
 */
module.exports = Directive;

/**
 * Should be extended by any SSI directive.
 */
function Directive() {
	// Nothing to do.
};

/**
 * Processes a directive. Override in subclasses.
 * @return The result of the directive processing.
 */
Directive.prototype.process = function() {
	// Nothing to do.
};
