/**
 * Requires.
 */
var IncludeDirective = require('./IncludeDirective');
var InvalidDirective = require('./InvalidDirective');

/**
 * Exports.
 */
module.exports = SsiProcessor;

function SsiProcessor() { 
	this.ssiPattern = /<!--#[a-z]+ +([a-z]+=".+?" +)*-->/;
	this.directivePattern = /[a-z]+/;
	this.parameterNamePattern = /[a-z]+=/g;
	this.parameterValuePattern = /".+?"/g;
};

/**
 * @param content The content to be processed by the SSI
 * @return The new content after SSI was processed. 
 */
SsiProcessor.prototype.processContent = function(content) {
	// TODO mention in doc that everything is case sensitive
	// (no uppercase letters unless required in values)
	// Syntax: <!--#directive parameter=value parameter=value -->
	var result = '';

	while (true) {
		var match = this.ssiPattern.exec(content);
		if (match == null) {
			result += content;
			break;
		}

		result += content.substring(0, match.index);
		
		result += this.processSsi(match[0]);

		content = content.substring(match.index + match[0].length);
	}
	
	return result;
};

SsiProcessor.prototype.processSsi = function(ssi) {
	var directive = this.directivePattern.exec(ssi)[0];
	
	var parameters = new Array();
	var parametersNames = ssi.match(this.parameterNamePattern); 
	for (var i = 0; i < parametersNames.length; i++) {
		var name = parametersNames[i];
		parameters.push({
			name : name.substring(0, name.length - 1)
		});
	}
	var parametersValues = ssi.match(this.parameterValuePattern); 
	for (var i = 0; i < parametersValues.length; i++) {
		var value = parametersValues[i];
		parameters[i].value = value.substring(1, value.length - 1);
	}
	
//	return directiveFactory(directive, parameters).process();
	return ssi; // TODO uncomment above and del this line
};

function directiveFactory(directive, parameters) {
	switch (directive) {
	case 'include':
		return new IncludeDirective(directive, parameters);
	// TODO add 'if' directive too
	default:
		return new InvalidDirective();
	}
}