/**
 * Requires.
 */
var util = require('util');
var url = require('url');
var path = require('path');
var fs = require('fs');
var Constants = require('../Constants');
var Request = require('./Request');
var ContentTypeEnum = require('./ContentTypeEnum');

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
	 * Contains data that can be used by subclasses.
	 * Should not override this object.
	 */
	this.protectedData = {
		/**
		 * The file name.
		 */
		filename : null,
		
		/**
		 * The file stats.
		 */
		stats : null,

		/**
		 * The file content type.
		 */
		contentType : ContentTypeEnum.NO_CONTENT,
	};
};

/**
 * @Override Request.process().
 */
HeadRequest.prototype.process = function() {
	try {
		// '..' is not allowed in a url.
		if (this.request.url.indexOf('..') != -1)
			throw 'ENOENT';

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
		this.protectedData.contentType =
			ContentTypeEnum.getContentType(this.protectedData.filename);
		this.response.writeHead(200, {
			'Content-Length' : this.protectedData.stats.size,
			'Content-Type' : this.protectedData.contentType
		});
	} catch (err) {
		// TODO maybe ENOENT not hardcoded
		if (err.code == 'ENOENT') { // File doesn't exist. Return 404.
			this.protectedData.contentType = ContentTypeEnum.NO_CONTENT;
			this.response.writeHead(404, {
				'Content-Length' : '0'
			});
		} else {
			throw err;
		}
	}
	
	this.responseEnd();
};

/**
 * Ends an HTTP response. Called independent of HTTP response status code.
 * Can be overridden by subclasses in case of more complex work after
 * headers where processed.
 */
HeadRequest.prototype.responseEnd = function() {
	this.response.end();
};
