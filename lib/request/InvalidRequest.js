/**
 * Requires.
 */
var util = require("util");
var Request = require("./Request");

/**
 * Exports.
 */
module.exports = GetRequest;
util.inherits(InvalidRequest, Request);

function InvalidRequest(request, response) {
	this.request = request;
	this.response = response;
};

InvalidRequest.prototype.process = function() {
	// TODO
};