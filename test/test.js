/**
 * Requires.
 */
var http = require('http');
var assert = require("assert");
var constants = require('../lib/Constants');
var HttpServer = require('../lib/HttpServer');
// var HttpServer = require('ssihttpserver'); // TODO remove

describe('HttpServer', function() {
	beforeEach(function() {
		// Server should be closed inside tests, after client finish request.
		this.httpServer = new HttpServer({
			port : constants.TEST_PORT
		});
		this.httpServer.start();
	});
	
	describe("#Head Request", function() {
		it('should return 404 on invalid file', function() {
			this.httpServer.afterStart(createClient(this.httpServer, 'HEAD',
					'/invalidFile', function(response) {
				assert.equal(response.statusCode, 404);
				assert.equal(response.headers['content-length'], 0);
			}));
		});
	});
});

function createClient(httpServer, method, filePath, onResponseCallback) {
	return function() {
		var request = http.request({
			hostname : 'localhost',
			port: constants.TEST_PORT,
			path : filePath,
			method : method
		}, function(response) {
			onResponseCallback(response);
			
			response.on('data', function(chunk) {
				console.log('data'); // TODO
			});

			response.on('end', function() {
				httpServer.close();
			});
		});

		request.on('error', function(e) {
			httpServer.close();

			// Force fail.
			assert.fail(false, true, 'Got error: ' + e.message);
		});

		request.end();
	};
};
