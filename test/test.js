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
//winston.remove(winston.transports.Console); // TODO uncomment

describe('Valid HttpServer', function() {
	var httpServer = null;
	beforeEach(function() {
		// Server should be closed inside tests, after client finish request.
		httpServer = new HttpServer({
			port: Constants.TEST_PORT,
			path: Constants.TEST_PATH
		});
		httpServer.start();
	});
	
	afterEach(function() {
		httpServer.close();
	});
	
	describe('#Head Request', function() {
		it('should return 404 on invalid file', function(done) {
			createClient('HEAD', '/invalidFile', test404Reponse(done));
		});
		
		it('should return 404 on folder with no index.html', function(done) {
			createClient('GET', '/noIndexHtmlFolder',	test404Reponse(done));
		});
		
		it('should return 200 on valid html file', function(done) {
			createClient('HEAD', '/index.html', test200Reponse('/index.html',
					ContentTypeEnum.HTML.type, done));
		});
		
		it('should return 200 on valid png file', function(done) {
			createClient('HEAD', '/Earth.png', test200Reponse('/Earth.png',
					ContentTypeEnum.PNG.type, done));
		});

		it('should return 200 on directory with index.html', function(done) {
			createClient('HEAD', '/', test200Reponse('/index.html',
					ContentTypeEnum.HTML.type, done));
		});
	});

	describe('#GET Request', function() {
		it('should return 404 on invalid file', function(done) {
			createClient('GET', '/invalidFile', test404Reponse(done));
		});
		
		it('should return 404 on folder with no index.html', function(done) {
			createClient('GET', '/noIndexHtmlFolder', test404Reponse(done));
		});
		
		it('should return 200 on valid html file', function(done) {
			createClient('GET', '/index.html',
					test200Reponse('/index.html', ContentTypeEnum.HTML.type),
					testFileContent('index.html', done));
		});
		
		it('should return 200 on valid css file', function(done) {
			createClient('GET', '/common.css',
					test200Reponse('/common.css', ContentTypeEnum.CSS.type),
					testFileContent('common.css', done));
		});
		
		it('should return 200 on directory with index.html', function(done) {
			createClient('GET', '/',
					test200Reponse('/index.html', ContentTypeEnum.HTML.type),
					testFileContent('index.html', done));
		});
	});
	
	describe('#Not implemented Request', function() {
		it('should return 501 on POST request', function(done) {
			createClient('POST', '/index.html', function(response) {
				assert.equal(response.statusCode, 501);
				done();
			});
		});
		
		it('should return 501 on DELETE request', function(done) {
			createClient('DELETE', '/index.html', function(response) {
				assert.equal(response.statusCode, 501);
				done();
			});
		});
	});
	
	describe('#SSI', function() {
		it('should process include directive with valid path', function(done) {
			createClient('GET', '/ssi/include.shtml',
					test200Reponse('/ssi/include.shtml.expected',
							ContentTypeEnum.SHTML.type),
					testFileContent('ssi/include.shtml.expected', done));
		});
		
		it('should process include directive with invalid paths',
				function(done) {
			createClient('GET', '/ssi/includeInvalidPaths.shtml',
					test200Reponse('/ssi/includeInvalidPaths.shtml.expected',
							ContentTypeEnum.SHTML.type),
					testFileContent('ssi/includeInvalidPaths.shtml.expected',
							done));
		});
		
		it('should process exec directive with cgi', function(done) {
			createClient('GET', '/ssi/execCgi.shtml',
					test200Reponse('/ssi/execCgi.shtml.expected',
							ContentTypeEnum.SHTML.type),
					testFileContent('ssi/execCgi.shtml.expected', done));
		});
		
		it('should process exec directive with valid cmd', function(done) {
			createClient('GET', '/ssi/execContent/execCmd.shtml',
					test200Reponse('/ssi/execContent/execCmd.shtml.expected',
							ContentTypeEnum.SHTML.type),
					testFileContent('ssi/execContent/execCmd.shtml.expected',
							done));
		});
		
		it('should process exec directive with invalid cmd', function(done) {
			createClient('GET', '/ssi/execInvalidCmd.shtml',
					test200Reponse('/ssi/execInvalidCmd.shtml.expected',
							ContentTypeEnum.SHTML.type),
					testFileContent('ssi/execInvalidCmd.shtml.expected', done));
		});
		
		it('should process multiple directives', function(done) {
			createClient('GET', '/ssi/multipleDirectives.shtml',
					test200Reponse('/ssi/multipleDirectives.shtml.expected',
							ContentTypeEnum.SHTML.type),
					testFileContent('ssi/multipleDirectives.shtml.expected',
							done));
		});
	});
});

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
 * @param filename The local filename.
 * @param type The type of the file content.
 * @param done [Optional] Function used by mocha for asynchronous code testing.
 * @returns {Function} An onResponseCallback.
 */
function test200Reponse(filename, type, done) {
	return function(response) {
		var stats = fs.statSync(path.join(Constants.TEST_PATH, filename));
		
		assert.equal(response.statusCode, 200);
		assert.equal(response.headers['content-length'], stats.size);
		assert.equal(response.headers['content-type'], type);
		
		if (done !== undefined) {
			done();
		}
	};
};

/**
 * @param filename The filename.
 * @param done Function used by mocha for asynchronous code testing.
 * @returns {Function} An onEndCallback.
 */
function testFileContent(filename, done) {
	return function(data) {
		fs.readFile(path.join(Constants.TEST_PATH, filename), 'binary',
				function(err, file) {
			assert.ok(!err);
			assert.equal(data.toString(), file);
			done();
		});
	};
};

/**
 * @param httpMethod The HTTP method.
 * @param httpPath The HTTP path.
 * @param onResponseCallback Callback to call on response.
 * @param onEndCallback [Optional] Callback to call on end response.
 */
function createClient(httpMethod, httpPath, onResponseCallback, onEndCallback) {
	var request = http.request({
		hostname : 'localhost',
		port: Constants.TEST_PORT,
		path : httpPath,
		method : httpMethod
	}, function(response) {
		onResponseCallback(response);
			
		var data = null;
		response.on('data', function(chunk) {
			if (data == null)
				data = chunk;
			else
				data += chunk;
		});
		
		response.on('end', function() {
			if (onEndCallback !== undefined) {
				onEndCallback(data);	
			}
		});
	});

	request.on('error', function(e) {
		// Force fail.
		assert.fail(false, true, 'Got error: ' + e.message);
	});

	request.end();
};
