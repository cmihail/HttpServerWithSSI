/**
 * Requires.
 */
var util = require('util');
var fs = require('fs');
var HeadRequest = require('./HeadRequest');
var ContentTypeEnum = require('./ContentTypeEnum');

/**
 * Exports.
 */
module.exports = GetRequest;
util.inherits(GetRequest, HeadRequest);

function GetRequest(request, response, serverPath) {
	GetRequest.super_.apply(this, arguments);
};

/**
 * @Override HttpRequest.responseEnd().
 */
GetRequest.prototype.responseEnd = function() {
	// Invalid file.
	if (this.protectedData.contentType == ContentTypeEnum.NO_CONTENT) {
		this.response.end();		
		return;
	}
	
	var getRequest = this;
	fs.readFile(this.protectedData.filename, 'binary', function(err, file) {
		if (err) {
			getRequest.response.write(err + '\n');
		} else {
			getRequest.response.write(file, 'binary');
		}
		getRequest.response.end();
	});
};