/**
 * Requires.
 */
var IncludeDirective = require('./IncludeDirective');
var InvalidDirective = require('./InvalidDirective');

/**
 * Exports.
 */
module.exports = SsiProcessor;

function SsiProcessor(serverPath) {
	this.serverPath = serverPath;
	// TODO mention in doc that everything is case sensitive
	// (no uppercase letters unless required in values)
	// Syntax: <!--#directive parameter=value parameter=value -->
	this.ssiPattern = /<!--#[a-z]+ +([a-z]+=".+?" +)*-->/;
	this.directivePattern = /[a-z]+/;
	this.parameterNamePattern = /[a-z]+=/g;
	this.parameterValuePattern = /".+?"/g;
};

/**
 * @param content The content to be processed by the SSI.
 * @param onEndCallback The callback to execute after content was processed.
 * Receives one argument: the result of the processed content.
 */
SsiProcessor.prototype.processContent = function(content, onEndCallback) {
	this.processContentHelper(content, onEndCallback, '');
};

SsiProcessor.prototype.processContentHelper = 
		function(content, onEndCallback, newContent) {
	var match = this.ssiPattern.exec(content);
	if (match == null) { // No more directives.
		newContent += content; 
		onEndCallback(newContent); // Process end callback.
		return;
	}
	
	// Add non directive content and strip content of all text until match end.
	newContent += content.substring(0, match.index);
	content = content.substring(match.index + match[0].length);
	
	// Process directive.
	var ssi = match[0];
	var ssiDirective = this.directivePattern.exec(ssi)[0];
	var paramNames = ssi.match(this.parameterNamePattern);
	var paramValues = ssi.match(this.parameterValuePattern);
	
	var directive;
	if (paramNames.length != paramValues.length) {
		directive = InvalidDirective();
	} else {
		var params = {};
		for (var i = 0; i < paramNames.length; i++) {
			var name = paramNames[i].substring(0, paramNames[i].length - 1);
			var value = paramValues[i].substring(1, paramValues[i].length - 1);
			params[name] = value;
		}
		
		directive = directiveFactory(ssiDirective, params, this.serverPath);
	}
	
	var ssiProcessor = this;
	directive.process(function(result) {
		newContent += result;
		ssiProcessor.processContentHelper(content, onEndCallback, newContent);
	});
};

function directiveFactory(directive, parameters, serverPath) {
	switch (directive) {
	case 'include':
		return new IncludeDirective(directive, parameters, serverPath);
	// TODO add 'if' directive too
	default:
		return new InvalidDirective();
	}
}