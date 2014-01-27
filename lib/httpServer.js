/**
 * Requires.
 */
var http = require('http');
var constants = require('./constants');

// TODO
var url = require("url");
var path = require("path");
var fs = require("fs");

/**
 * Module exports.
 */
module.exports = exports = HttpServer;

/**
 * TODO - declare inputArgs
 */
function HttpServer(inputArgs) {
	this.args = {
		port : constants.DEFAULT_PORT,
		path : constants.DEFAULT_PATH, // Should be an existing folder.
	};

	// Merge with input args.
	for (var attr in inputArgs) {
		this.args[attr] = inputArgs[attr];
		
	}
};

/**
 * Start server and listen continuously for new connections.
 */
HttpServer.prototype.start = function() {
	console.log("Start server on port: " + this.args.port);
	this.server = http.createServer(requestListener);
	this.server.listen(this.args.port);
};

/**
 * Close server. Useful for testing.
 */
HttpServer.prototype.close = function() {
	console.log("Closing the server");
	this.server.close();
};

// TODO, source: http://stackoverflow.com/questions/6084360/node-js-as-a-simple-web-server
function requestListener(request, response) {
	var uri = url.parse(request.url).pathname;
	var filename = path.join(process.cwd() + "/" + constants.DEFAULT_PATH, uri);

	fs.exists(filename, function(exists) {
		if (!exists) {
			response.writeHead(404, {
				"Content-Type" : "text/plain"
			});
			response.write("404 Not Found\n");
			response.end();
			return;
		}

		if (fs.statSync(filename).isDirectory())
			filename += '/index.html';

		fs.readFile(filename, "binary", function(err, file) {
			if (err) {
				response.writeHead(500, {
					"Content-Type" : "text/plain"
				});
				response.write(err + "\n");
			} else {
				response.writeHead(200);
				response.write(file, "binary");
			}
			response.end();
		});
	});
};
