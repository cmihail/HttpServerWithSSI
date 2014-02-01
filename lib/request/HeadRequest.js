/**
 * Requires.
 */
var util = require('util');
var url = require('url');
var path = require('path');
var fs = require('fs');
var Constants = require('../Constants');
var ContentTypeEnum = require('./ContentTypeEnum');
var Request = require('./Request');

/**
 * Exports.
 */
module.exports = HeadRequest;
util.inherits(HeadRequest, Request);

/**
 * @param request An HTTP request.
 * @param response The HTTP response for the request.
 * @param serverPath The server path.
 */
function HeadRequest(request, response, serverPath) {
	this.request = request;
	this.response = response;
	this.serverPath = serverPath;
	
	/**
	 * Contains data that can be used by subclasses.
	 * Should not override this object.
	 */
	this.protectedData = {
		/**
		 * The filename.
		 */
		filename: null,
		
		/**
		 * The file stats.
		 */
		stats: null,

		/**
		 * The file content type.
		 */
		contentType: ContentTypeEnum.NO_CONTENT,		
	};
};

/**
 * @Override Request.process().
 */
HeadRequest.prototype.process = function() {
	try {
		// '..' is not allowed in a url.
		if (this.request.url.indexOf('..') != -1)
			throw Constants.ERROR_INEXISTENT_FILE;
		
		// Get file info from url.
		var uri = url.parse(this.request.url).pathname;
		this.protectedData.filename = path.join(this.serverPath, uri);
		this.protectedData.stats =
			fs.statSync(this.protectedData.filename);

		// Try to server default file if directory.
		if (this.protectedData.stats.isDirectory()) {
			this.protectedData.filename += Constants.DEFAULT_FILE;
			this.protectedData.stats = // Must get default file stats.
				fs.statSync(this.protectedData.filename);
		}

		// Return 200.
		this.response.statusCode = 200;
		this.protectedData.contentType =
			ContentTypeEnum.getContentType(this.protectedData.filename);
		this.response.setHeader('Content-Length',
				this.protectedData.stats.size);
		this.response.setHeader('Content-Type',
				this.protectedData.contentType.type);
	} catch (err) {
		// File doesn't exist. Return 404.
		if (err.code == Constants.ERROR_INEXISTENT_FILE) {
			this.response.statusCode = 404;
			this.protectedData.contentType = ContentTypeEnum.NO_CONTENT;
			this.response.setHeader('Content-Length', 0);
		} else {
			throw err;
		}
	}
	
	this.endResponse();
};

/**
 * Ends an HTTP response. Called independent of HTTP response status code.
 * Can be overridden by subclasses in case of more complex work after
 * headers where processed.
 */
HeadRequest.prototype.endResponse = function() {
	this.response.end();
};
