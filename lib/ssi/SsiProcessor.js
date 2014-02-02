/**
 * Requires.
 */
var winston = require('winston');
var IncludeDirective = require('./IncludeDirective');
var ExecDirective = require('./ExecDirective');
var InvalidDirective = require('./InvalidDirective');

/**
 * Exports.
 */
module.exports = SsiProcessor;

function SsiProcessor() {
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
 * @param workingDir The working directory.
 * @param onEndCallback The callback to execute after content was processed.
 * Receives one argument: the result of the processed content.
 */
SsiProcessor.prototype.processContent =
		function(content, workingDir, onEndCallback) {
	this.processContentHelper(content, workingDir, onEndCallback, '');
};

/**
 * Recursive helper function for processContent().
 */
SsiProcessor.prototype.processContentHelper = 
		function(content, workingDir, onEndCallback, newContent) {
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
		
		directive = directiveFactory(ssiDirective, params);
	}
	
	
	// Process directive in the working directory.
	var oldDir = process.cwd();
	if (!changeWorkingDir(workingDir)) {
		onEndCallback(newContent); // Force end callback.
		return;
	}

	var ssiProcessor = this;
	directive.process(function(result) {
		// Restore old directory.
		if (!changeWorkingDir(oldDir)) {
			onEndCallback(newContent); // Force end callback.
			return;
		}
		
		// Process remaining content.
		newContent += result;
		ssiProcessor.processContentHelper(content, workingDir, onEndCallback,
				newContent);			
	});
};

/**
 * @param directive The SSI directive.
 * @param parameters The directive parameters.
 * @returns A directive object.
 */
function directiveFactory(directive, parameters) {
	switch (directive) {
	case 'include':
		return new IncludeDirective(parameters);
	case 'exec':
		return new ExecDirective(parameters);
	// TODO maybe add 'printenv' directive too
	default:
		return new InvalidDirective();
	}
};

/**
 * @param newDir The new directory to set.
 * @returns {Boolean} True if change was successful.
 */
function changeWorkingDir(newDir) {
	try {
		process.chdir(newDir);
	} catch (err) {
		winston.warn('Couldn\'t change SSI directory to "' + newDir + '". ' +
				'Error: ' + err);
		return false;
	}
	return true;
};
