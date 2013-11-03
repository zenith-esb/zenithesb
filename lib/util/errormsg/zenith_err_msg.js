/**
 * Module to create Zenith message object for error situation. if the
 * options are not set, default error message will be generated
 */

var zenithMessage = require('../../zenith_message');


exports.getZenithErrorMSG = function(message, contentType, statusCode, options){
	
	var option = options || null;
	if(option != null)
	  zenithMessage.transportHeaders = option;	
	
	
	  zenithMessage.transportHeaders.headers['content-type'] = contentType;
	  zenithMessage.transportHeaders.statusCode = statusCode;
	  zenithMessage.body = message;
	return zenithMessage;
	
}