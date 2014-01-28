/**
 * Requires.
 */
var util = require("util");
var fs = require("fs");
var HeadRequest = require("./HeadRequest");
var ContentTypeEnum = require("./ContentTypeEnum");

/**
 * Exports.
 */
module.exports = GetRequest;
util.inherits(GetRequest, HeadRequest);

function GetRequest(request, response, serverPath) {
	this.request = request;
	this.response = response;
	this.serverPath = serverPath;
};

GetRequest.prototype.process = function() {
	GetRequest.super_.prototype.process.apply(this);

	// Invalid file.
	if (this.contentType == ContentTypeEnum.NO_CONTENT) {
		return;
	}
	console.log(this.contentType + " AAAAAA\n") // TODO del
	
	var getRequest = this;
	fs.readFile(this.filename, "binary", function(err, file) {
		if (err) {
			getRequest.response.write(err + "\n");
		} else {
			getRequest.response.write(file, "binary");
		}
	});
};
