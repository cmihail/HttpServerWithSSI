/**
 * Requires.
 */
var http = require('http');
var fs = require('fs');
var winston = require('winston');
var Constants = require('./Constants');
var HeadRequest = require('./request/HeadRequest');
var GetRequest = require('./request/GetRequest');
var InvalidRequest = require('./request/InvalidRequest');

/**
 * Exports.
 */
module.exports = HttpServer;

/**
 * @param inputArgs [Optional] An object with optional port and/or path members
 * that are used for server configuration. If port/path are undefined, then
 * default values are used. Any extra member is ignored.
 */
function HttpServer(inputArgs) {
	this.args = {
		port : Constants.DEFAULT_PORT,
		path : Constants.DEFAULT_PATH,
	};

	// Merge with input args.
	for (var attr in inputArgs) {
		this.args[attr] = inputArgs[attr];
	}
	
	// Test if path exists.
	if (fs.statSync(this.args.path).isDirectory()) {
		this.server =
			http.createServer(createRequestListener(this.args.path));     
	} else {
		winston.error("Invalid server path");
	}
};

/**
 * Start server and listen continuously for new connections.
 */
HttpServer.prototype.start = function() {
	if (this.server !== undefined) {
		winston.info("Start server on port: " + this.args.port);
		this.server.listen(this.args.port);
	}
};

/**
 * Close server. Useful for testing.
 */
HttpServer.prototype.close = function() {
	if (this.server !== undefined) {
		winston.info("Closing the server");
		this.server.close();
	}
};

/**
 * Create a requestListener for new connections.
 * The request should be closed inside the Request.process() method.
 * @param path The server path.
 */
createRequestListener = function(path) {
	return function(request, response) {
		var httpRequest;
		
		// TODO test all requests
		switch (request.method) {
		case 'HEAD':
			winston.info('Process HEAD request with url: ' + request.url);
			httpRequest = new HeadRequest(request, response, path);
			break;
		case 'GET':
			winston.info('Process GET request with url: ' + request.url);
			httpRequest = new GetRequest(request, response, path);
			break;
		default:
			winston.info('Not implemented request: ' + request.method);
			httpRequest = new InvalidRequest(response, 501);
			break;
		}
		
		// Process request.
		try {
			httpRequest.process();
		} catch (err) {
			winston.error("Server exception: " + err);
			new InvalidRequest(response, 500).process();
		}
	};
};
