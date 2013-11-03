/**
 * Simple content based routing scenario. This configuration
 * checks whether message body has value 'IBM' for the element
 * 'symbol'.
 */

var SUPPORT_LIBS = '../lib/support/';
var logger = require('../lib/logger');
var soapErrorMsg = require('../lib/util/errormsg/soap_err_msg');
var zenithErrorMsg = require('../lib/util/errormsg/zenith_err_msg');

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
				
					if(!err){
						
						callback(null, message);	
					} else {
						//send error message for error situation
						//can create more detailed errors by reading fields in 'err' object
						var errMsg = soapErrorMsg.getSOAP11Fault('Connection Refused.'); 
						var errZenithMessage = zenithErrorMsg.getZenithErrorMSG(errMsg, 'text/xml', '503');
						callback(null, errZenithMessage);
					}
						
			});					
				
				
			} else {
				//set the message body to the error message
				var errMsg = oapErrorMsg.getSOAP11Fault('Message does not contain \'' + elemValue +'\'.'); 
				var errZenithMessage = zenithErrorMsg.getZenithErrorMSG(errMsg, 'text/xml', '400');
				callback(null, errZenithMessage);
			}
		} else {
			//error in the saxProcessor
			var errMsg = oapErrorMsg.getSOAP11Fault('Error in SAX processing unite.'); 
			var errZenithMessage = zenithErrorMsg.getZenithErrorMSG(errMsg, 'text/xml', '500');
			callback(null, errZenithMessage);
		}
		
	});
	
}


