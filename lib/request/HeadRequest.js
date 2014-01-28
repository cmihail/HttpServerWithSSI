/**
 * Requires.
 */
var util = require("util");
var url = require("url");
var path = require("path");
var fs = require("fs");
var Request = require("./Request");
var ContentTypeEnum = require("./ContentTypeEnum");

/**
 * Exports.
 */
module.exports = HeadRequest;
util.inherits(HeadRequest, Request);

function HeadRequest(request, response, serverPath) {
	this.request = request;
	this.response = response;
	this.serverPath = serverPath;

	/**
	 * The file name.
	 */
	this.filename;

	/**
	 * The file content type.
	 */
	this.contentType = ContentTypeEnum.NO_CONTENT;
};

HeadRequest.prototype.process = function() {
	var uri = url.parse(this.request.url).pathname;
	this.filename = path.join(process.cwd() + "/" + this.serverPath, uri);

	// TODO this.serverPath is undefined here
	// For directories, try serve index.html (if non-existent, give error).
//	if (fs.statSync(this.filename).isDirectory()) // TODO test this
//		this.filename += '/index.html';
	
	var headRequest = this;
	fs.exists(this.filename, function(exists) {
		if (!exists) {
			headRequest.response.writeHead(404, {
				"Content-Length" : "0"
			});

			headRequest.contentType = ContentTypeEnum.NO_CONTENT;
			headRequest.response.end();
			return;
		}

		// TODO modidy this so it is type dependent
//		headRequest.response.writeHead(500, {
//			"Content-Type" : "text/plain"
//		});
		headRequest.response.writeHead(200);
		headRequest.contentType = ContentTypeEnum.TXT;
	});
};
