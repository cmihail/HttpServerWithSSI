/**
 * Requires.
 */
var http = require('http');
var fs = require('fs');
var path = require('path');
var assert = require('assert');
var winston = require('winston');
var Constants = require('../lib/Constants');
var HttpServer = require('../lib/HttpServer');
var ContentTypeEnum = require('../lib/request/ContentTypeEnum');
// var HttpServer = require('ssihttpserver'); // TODO remove

// Ignore server output.
winston.remove(winston.transports.Console);

describe('HttpServer', function() {
	var httpServer = null;
	beforeEach(function() {
		// Server should be closed inside tests, after client finish request.
		httpServer = new HttpServer({
			port : Constants.TEST_PORT
		});
		httpServer.start();
	});
	
	describe('#Head Request', function() {
		it('should return 404 on invalid file', function(done) {
			httpServer.afterStart(createClient(httpServer, 'HEAD',
					'/invalidFile', test404Reponse(done)));
		});
		
		it('should return 404 on empty folder', function(done) {
			httpServer.afterStart(createClient(httpServer, 'GET',
					'/emptyFolder', test404Reponse(done)));
		});
		
		it('should return 200 on valid file', function(done) {
			httpServer.afterStart(createClient(httpServer, 'HEAD', 
					'/index.html', test200Reponse('/index.html', done)));
		});
		
		it('should return 200 on directory with index.html', function(done) {
			httpServer.afterStart(createClient(httpServer, 'HEAD',
					'/', test200Reponse('/index.html', done)));
		});
	});

	describe('#GET Request', function() {
		it('should return 404 on invalid file', function(done) {
			httpServer.afterStart(createClient(httpServer, 'GET',
					'/invalidFile', test404Reponse(done)));
		});
		
		it('should return 404 on empty folder', function(done) {
			httpServer.afterStart(createClient(httpServer, 'GET',
					'/emptyFolder', test404Reponse(done)));
		});
		
		it('should return 200 on valid file', function(done) {
			httpServer.afterStart(createClient(httpServer, 'GET',
					'/index.html', test200Reponse('/index.html'),
					testFileContent('index.html', done)));
		});

		it('should return 200 on directory with index.html', function(done) {
			httpServer.afterStart(createClient(httpServer, 'GET',
					'/', test200Reponse('/index.html'),
					testFileContent('index.html', done)));
		});
	});
});

function getFileStats(filename) {
	return fs.statSync(path.join(Constants.DEFAULT_PATH, filename));
}

/**
 * @param done Function used by mocha for asynchronous code testing.
 * @returns {Function} An onResponseCallback.
 */
function test404Reponse(done) {
	return function(response) {
		assert.equal(response.statusCode, 404);
		assert.equal(response.headers['content-length'], 0);
		done();
	};
};

/**
 * @param filename The file name.
 * @param done [Optional] Function used by mocha for asynchronous code testing.
 * @returns {Function} An onResponseCallback.
 */
function test200Reponse(filename, done) {
	return function(response) {
		var stats = getFileStats(filename);
		
		assert.equal(response.statusCode, 200);
		assert.equal(response.headers['content-length'], stats.size);
		assert.equal(response.headers['content-type'],
				ContentTypeEnum.HTML);
		
		if (done !== undefined) {
			done();
		}
	};
};

/**
 * @param filename The file name.
 * @param done Function used by mocha for asynchronous code testing.
 * @returns {Function} An onEndCallback.
 */
function testFileContent(filename, done) {
	return function (data) {
		fs.readFile(path.join(Constants.DEFAULT_PATH, filename), 'binary',
				function(err, file) {
			if (err) {
				assert.equal(data, err);
			} else {
				assert.equal(data, file);
			}
			done();
		});
	};
};

/**
 * @param httpServer The HttpServer instance.
 * @param httpMethod The HTTP method.
 * @param httpPath The HTTP path.
 * @param onResponseCallback Callback to call on response.
 * @param onEndCallback [Optional] Callback to call on end response.
 * @returns {Function}
 */
function createClient(httpServer, httpMethod, httpPath, onResponseCallback,
		onEndCallback) {
	return function() {
		var request = http.request({
			hostname : 'localhost',
			port: Constants.TEST_PORT,
			path : httpPath,
			method : httpMethod
		}, function(response) {
			onResponseCallback(response);
			
			var data = '';
			response.on('data', function(chunk) {
				data += chunk;
			});
			
			response.on('end', function() {
				httpServer.close();
				if (onEndCallback !== undefined) {
					onEndCallback(data);	
				}
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
