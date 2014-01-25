// TODO maybe not by path but by using npm
// TODO add dependency when creating npm for nodeunit or mention nodeunit must be
// installed for tests

const PORT = 8765;
const TIMEOUT = 300;

/**
 * Requires.
 */
var http = require('http');
var HttpServer = require('../lib/HttpServer');

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
			callback();
		}, TIMEOUT);
	},

	test1 : function(test) {
		runClient(PORT);

		test.equals('bar', 'bar');
		test.done();
	}
};

function runClient(port) {
	console.log("Client port: " + port);
	var a = http.get("http://localhost:" + port + "/index.html", function(res) {
		console.log("Got response: " + res.statusCode);
        res.on('data', function(chunk){
            console.log("data")
        });
        res.on('end', function(){
            console.log("end")
        });
	}).on('error', function(e) {
		console.log("Got error: " + e.message);
	});
};
