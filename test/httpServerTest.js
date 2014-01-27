/**
 * Constants.
 */
const PORT = 8765;
const TIMEOUT = 300;

/**
 * Requires.
 */
var http = require('http');
//var HttpServer = require('ssihttpserver'); // TODO remove
var HttpServer = require('../lib/httpServer');

module.exports = {
	setUp : function(callback) {
		this.server = new HttpServer({
			port : PORT
		});
		this.server.start();
		callback();
	},

	tearDown : function(callback) {
		// clean up
		var server = this.server;
		setTimeout(function() {
			server.close();
		}, TIMEOUT);
		
		callback();
	},

	test1 : function(test) {
		runClient(PORT);

		test.equals('bar', 'bar');
		test.done();
	}
};

function runClient(port) {
	console.log("Client port: " + port);
	
	http.get("http://localhost:" + port + "/index.html", function(res) {
		console.log("Got response: " + res.statusCode);
        res.on('data', function(chunk){
            console.log("data");
        });
        res.on('end', function(){
            console.log("end");
        });
	}).on('error', function(e) {
		console.log("Got error: " + e.message);
	});
};
