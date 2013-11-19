/**
 * test file for /lib/message_builder.js 
 */
var vows = require('vows'), assert = require('assert');
var messageBuilder = require('../../lib/message_builder.js');
var request = {}; //sample request object.
var response = {}; //sample response object.
 

/**
 * test case for building message using the incoming request
 */
messageBuilder.buildMessage(request, function(result){
	//result is the built message
});

/**
 * test case for building response using the zenith message object
 */
msgBuilder.buildResponse(zenithMessage,request, response, function(err,final_resp){
	//final_resp is the response modified to send back to the user. 
	
});