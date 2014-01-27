/**
 * Requires.
 */
var http = require('http');
var constants = require('../lib/Constants');
var HttpServer = require('../lib/HttpServer');
//var HttpServer = require('ssihttpserver'); // TODO remove

module.exports = {
	setUp : function(callback) {
		this.httpServer = new HttpServer({
			port : constants.TEST_PORT
		});
		this.httpServer.start();
		callback();
	},

	tearDown : function(callback) {
		// Server should be closed by client on connection end.
		callback();
	},

	test1 : function(test) {
		var httpServer = this.httpServer;
		httpServer.afterStart(function() {
			runClient(constants.TEST_PORT, httpServer);
			test.equals('bar', 'bar'); // TODO del
			test.done();
		});
	}
};

function runClient(port, httpServer) {
	console.log("Client port: " + port);
	
	http.get("http://localhost:" + port + "/index.html", function(res) {
		console.log("Got response: " + res.statusCode);
        res.on('data', function(chunk){
            console.log("data"); // TODO
        });
        res.on('end', function(){
            httpServer.close();
        });
	}).on('error', function(e) {
		console.log("Got error: " + e.message);
		httpServer.close();
	});
};
