/**
 * Exports.
 */
module.exports = Request;

/**
 * Should be extended by any HTTP request.
 *
 * Child class SHOULD close response.
 */
function Request() {
	// Nothing to do.
};

/**
 * Process a request. Override in subclasses.
 */
Request.prototype.process = function() {
	// Nothing to do.
};
