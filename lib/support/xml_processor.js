/**
 * Module to handle xml related processing
 */
var childProcess = require('child_process');
var xpath_process = childProcess.fork('../../subprocess/xml_xpath_process');
var logger = require('../logger');

/**
 * call the sub process to process xml related checking in the background
 * @param xmlStrng xml body 
 * @param xpath xpath query to process
 * @param checkRegExp whether to check with some regExpression
 * @param regExp regexp to check
 * @param callback
 */
function callSubProcess(xmlStrng, xpath, checkRegExp, regExp, callback){
	
	var arg = { 
			xml: xmlStrng, 
			xpath: xpath, 
			regEx: regExp, 
			caseSense:false,
			checkRegEx :checkRegExp
			} ;
	xpath_process.on('message', function(result) {
		  callback(null, result);//return the result
	});
	
	xpath_process.on('error', function(err) {
		  logger.error('XMLProcessor', 'Error in XPath process ' +
				  err.message);
		  callback(err);
	});
	
	xpath_process.send(arg);
}

/**
 * check the element value of the given XPath condition with the regular
 * expression. return value is a boolean
 * @param xmlStrng xml body 
 * @param xpath xpath query to process
 * @param regExp regexp to check
 * @param callback return err, result. result is a boolean
 */
exports.isValidRegExp = function(xmlStrng, xpath, regExp, callback){
	callSubProcess(xmlStrng, xpath, true, regExp, function(err, result){
		if(!err){
			callback(null, result);
		} else {
			callback(err);
		}
	});	
	
}

/**
 * get the element value for the given xpath condition
 * @param xmlStrng xml body 
 * @param xpath xpath query to process
 * @param callback return err, result. result is a string
 */
exports.getElemValue = function(xmlStrng, xpath, callback){
	
	callSubProcess(xmlStrng, xpath, false, null, function(err, result){
		if(!err){
			callback(null, result);
		} else {
			callback(err);
		}
	});
	
}
