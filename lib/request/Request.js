/**
 * Exports.
 */
module.exports = Request;

/**
 * Should be extended by any HTTP request.
 * Child class SHOULD close response.
 */
function Request() {
	// Nothing to do.
};

/**
 * Processes a request. Override in subclasses.
 */
Request.prototype.process = function() {
	// Nothing to do.
};
