/**
 * Exports.
 */
module.exports = Request;

/**
 * Should be extended by any HTTP request.
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
