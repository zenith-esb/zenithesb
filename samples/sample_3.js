/**
 * Simple content based routing scenario. This configuration
 * checks whether message body has value 'IBM' for the element
 * 'symbol'.
 */

var SUPPORT_LIBS = '../lib/support/';
var logger = require('../lib/logger');
var saxProcessor = require(SUPPORT_LIBS + 'xml/sax_processor');

exports.executeSample = function(zenithMessage, callback){

	var serviceURL = 'http://localhost:9000/services/SimpleStockQuoteService';
	var soapElement = 'symbol';
	var soapElementNmSpcURI = 'http://services.samples';
	var elemValue = 'IBM';
	
	var saxProcessor = require(SUPPORT_LIBS + 'xml/sax_processor');
	
	saxProcessor.getElementValue(zenithMessage.body, 
			soapElementNmSpcURI, soapElement, function(err, value){
				
		if(err == null){ // no error		
			//if element has the correct value, call service
			if(value[0] === elemValue){
				var option = {
						url : serviceURL
					};
						
			var endpoint = require(SUPPORT_LIBS + 'ws_endpoint');
					
			endpoint.callService(zenithMessage, option, function(err,message){		
					callback(null, message);		
			});					
				
				
			} else {
				//set the message body to the error message
				var errMsg = 'Message does not contain \'' + elemValue +'\'.'; 
				zenithMessage.body = soapErrorMsg.getSOAP11Fault(errMsg);
				callback(null, zenithMessage);
			}
		}
		
	});
	
}