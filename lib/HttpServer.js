/**
 * Default values.
 */
const DEFAULT_PORT = 8080;
const DEFAULT_PATH = '../filesRoot';

/**
 * Requires.
 */
var http = require('http');

// TODO
var http = require("http"), url = require("url"), path = require("path"), fs = require("fs")
port = process.argv[2] || 8888;

/**
 * Module exports.
 */
module.exports = exports = HttpServer;

/**
 * TODO - declare inputArgs
 */
function HttpServer(inputArgs) {
	this.args = {
		port : DEFAULT_PORT,
		path : DEFAULT_PATH,
	};

	// Merge with input args.
	for ( var attr in inputArgs) {
		this.args[attr] = inputArgs[attr];
	}

	this.server = http.createServer(requestListener);
};

HttpServer.prototype.start = function() {
	console.log("Start server on port: " + this.args.port);
	this.server.listen(this.args.port);
};

HttpServer.prototype.close = function() {
	console.log("Closing the server");
	this.server.close();
};

// TODO, source: http://stackoverflow.com/questions/6084360/node-js-as-a-simple-web-server
function requestListener(request, response) {
	var uri = url.parse(request.url).pathname;
	var filename = path.join(process.cwd() + "/" + DEFAULT_PATH, uri);

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
