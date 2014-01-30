/**
 * Requires.
 */
var util = require("util");
var Request = require("./Request");

/**
 * Exports.
 */
module.exports = InvalidRequest;
util.inherits(InvalidRequest, Request);

/**
 * @param response An HTTP response.
 * @param statusCode The HTTP status code to write in the response.
 */
function InvalidRequest(response, statusCode) {
	this.response = response;
	this.statusCode = statusCode;
};

/**
 * @Override Request.process().
 */
InvalidRequest.prototype.process = function() {
	this.response.writeHead(this.statusCode);
	this.response.end();
};
