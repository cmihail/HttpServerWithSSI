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
 * @param onEndCallback Function to call after directive processing ends.
 * Receives one argument: the result of the processed directive.
 */
Directive.prototype.process = function(onEndCallback) {
	// Nothing to do.
};
