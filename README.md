HttpServerWithSSI
=================

This project implements an HTTP server in Node.js with support for basic
Server Side Include (SSI).

It supports basic HEAD and GET methods, the only 2 methods required by RFC2616.
HEAD returns the same results as GET, with the exception of the body. The
server is file-based, and for directories given as URLs, the server will return
the DEFAULT_FILE ("index.html", see "lib/Constants"). If there is no default
file, the server returns 404 for both HEAD and GET.

## SSI supported directives
- "include" -> basic implementation with only one attribute named "file";
no "/" at start or ".." are allowed
- "exec" -> supports both "cgi" and "cmd" attributes; if both arguments
are supplied, only "cgi" is taken into consideration; "cgi" scripts MUST
be executable
- "printenv" -> prints environmental variables; no attributes
- SSI directives are case sensitive, and they should have the exact syntax
defined at http://httpd.apache.org/docs/current/howto/ssi.html

## Implementation
The server is based on Factory Pattern in order to make it easy to add or
change implementations of HTTP method requests or SSI directives. SSI
directives are processed using asynchronous callback functions and a sort of
recursion. More exactly, the function SsiProcessor.processContentHelper()
processes the file content by searching for SSI directives. If any is found,
it processes the directive and executes a callback (the callback is needed
because of asynchronous callbacks to the file system). The callback will call
again SsiProcessor.processContentHelper() until all file content is processed.

## NPM modules
- "argchecker" -> used to process command line arguments, like PORT and PATH
- "winston" -> logger on node.js
- "mocha" -> testing framework

## Installation / Uninstallation:
- npm install [--dev] [-g] ssihttpserver
- npm uninstall [--dev] [-g] ssihttpserver
- [-g] is for global
- [--dev] is needed for dev modules; if this option doesn't work, then
"npm install ssihttpserver" and "npm install -g mocha"

## Run:
- locally: INSTALL_DIR/node_modules/.bin/httpServer [--port PORT] [--path PATH]
- globally: httpServer [--port PORT] [--path PATH]
- PORT and PATH are optionally
- default PORT is 8080 and default PATH is APP_DIR/serverRoot
- nodejs / node are needed to run the program successful (nodejs for the httpServer,
and node for mocha)

## Usage:
```js
var HttpServer = require('ssihttpserver');

// HttpServer arguments are optional
var httpServer = new HttpServer({
	port: [PORT],
	path: [PATH]
});

// Start server
httpServer.start();

...

// Close server
httpServer.close();
```

## Testing
- uses "mocha" library; MUST be in the application root directory when running
"mocha"; any other directory will not work
- tests are full stack; they represent clients that connect to the server and
send different HTTP requests
- some tests will work only on UNIX Operating Systems, like the "exec" tests;
it uses the "ls" command, not "dir"; if on Windows, use "cygwin";
"testRoot/ssi/script.cgi" SHOULD be executable for successful run of tests
- if detailed information about the server is needed, the next line should be
commented in "test/test.js":
```js
winston.remove(winston.transports.Console);
```
- for manual testing, add more files to "serverRoot" or change the DEFAULT_PATH
to "testRoot" and use a browser
- "testRoot/ssi/execCgi.shtml.expected" test is taken from
http://help.cs.umn.edu/web/cgi-tutorial

## Documentation
- http://www.ietf.org/rfc/rfc2616.txt
- https://github.com/tasogarepg/argchecker
- https://github.com/flatiron/winston/
- http://visionmedia.github.io/mocha/
- http://nodejs.org/api/http.html
- http://nodejs.org/docs/latest/api/util.html
- http://decodize.com/javascript/build-nodejs-npm-installation-package-scratch/
- http://nodejs.org/api/assert.html
- http://httpd.apache.org/docs/current/howto/ssi.htmls
- http://en.wikipedia.org/wiki/Server_Side_Includes
- http://www.htmlgoodies.com/beyond/webmaster/article.php/3473341

