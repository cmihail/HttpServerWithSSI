/**
 * Requires.
 */
var http = require('http');
var constants = require('./Constants');
var GetRequest = require('./request/GetRequest');

/**
 * Exports.
 */
module.exports = HttpServer;

/**
 * @param inputArgs? An object with optional port and/or path members that are
 * used for server configuration. If port/path are undefined, then default
 * values are used. Any extra member is ignored.
 * The inputArgs argument is optional.
 */
function HttpServer(inputArgs) {
	this.args = {
		port : constants.DEFAULT_PORT,
		path : constants.DEFAULT_PATH, // Should be an existing folder. TODO Maybe test it
	};

	// Merge with input args.
	for (var attr in inputArgs) {
		this.args[attr] = inputArgs[attr];
	}
	
	this.server = http.createServer(createRequestListener(this.args.path));
};

/**
 * Start server and listen continuously for new connections.
 */
HttpServer.prototype.start = function() {
	console.log("Start server on port: " + this.args.port);
	this.server.listen(this.args.port);
};

/**
 * Close server. Useful for testing.
 */
HttpServer.prototype.close = function() {
	console.log("Closing the server");
	this.server.close();
};

/**
 * Execute a callback after server was started. Useful for testing.
 * @param callback The callback to execute after server start.
 */
HttpServer.prototype.afterStart = function(callback) {
	callback();
};

/**
 * Create a requestListener for new connections.
 * @param path The server path.
 */
function createRequestListener(path) {
	return function(request, response) {
		var httpRequest;
	
		// TODO test all requests
		switch (request.method) {
		case 'HEAD':
			httpRequest = new HeadRequest(request, response);
			break;
		case 'GET':
			httpRequest = new GetRequest(request, response, path);
			break;
		default:
			httpRequest = new InvalidRequest();
			break;
		}
		
		// Process request.
		httpRequest.process();
		
		// End connection.
		response.end();
	};
};
