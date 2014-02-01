/**
 * Requires.
 */
var util = require('util');
var fs = require('fs');
var ContentTypeEnum = require('./ContentTypeEnum');
var HeadRequest = require('./HeadRequest');
var SsiProcessor = require('../ssi/SsiProcessor');

/**
 * Exports.
 */
module.exports = GetRequest;
util.inherits(GetRequest, HeadRequest);

/**
 * @param request An HTTP request.
 * @param response The HTTP response for the request.
 * @param serverPath The server path.
 */
function GetRequest(request, response, serverPath) {
	GetRequest.super_.apply(this, arguments);
};

/**
 * @Override HttpRequest.responseEnd().
 */
GetRequest.prototype.endResponse = function() {
	// Invalid file.
	if (this.protectedData.contentType == ContentTypeEnum.NO_CONTENT) {
		this.response.end();
		return;
	}
	
	var getRequest = this;
	fs.readFile(this.protectedData.filename, 'binary', function(err, file) {
		if (err) {
			throw err;
		} else {
			if (getRequest.protectedData.contentType == ContentTypeEnum.SHTML) {
				processShtml(getRequest, file);
			} else {
				getRequest.response.write(file, 'binary');
				getRequest.response.end();
			}
		}
	});
};

/**
 * @param getRequest The GET request.
 * @param file The file with the SSI directives.
 */
function processShtml(getRequest, file) {
	var processor = new SsiProcessor(getRequest.serverPath);
	processor.processContent(file, function(result) {
		getRequest.response.setHeader("Content-Length", result.length);
		getRequest.response.write(result, 'binary');
		getRequest.response.end();
	});
};
