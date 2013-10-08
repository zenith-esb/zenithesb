/**
 * Message mediation scenario. Send the message defined in the SOAP
 * WS-Addressing EPR value.
 */

var SUPPORT_LIBS = '../lib/support/';
var logger = require('../lib/logger');
var saxProcessor = require(SUPPORT_LIBS + 'xml/sax_processor');
var soapErrorMsg = require('../lib/util/errormsg/soap_err_msg');

exports.executeSample = function(zenithMessage, callback){

	var serviceURL; 	
	
	//this defines the header field values in the soap message.	
	var soapHeaderElement = 'To';
	var soapHeaderElementNmSpcURI = 'http://www.w3.org/2005/08/addressing';
	
	
	var saxProcessor = require(SUPPORT_LIBS + 'xml/sax_processor');
	
	saxProcessor.getElementValue(zenithMessage.body, 
			soapHeaderElementNmSpcURI, soapHeaderElement, function(err, value){
				
		if(err == null){ // no error	
			serviceURL = value[0];
			logger.debug('SampleConfig', 'EPR: ' + serviceURL);			
			
			var option = {
					url : serviceURL
				};
						
			var endpoint = require(SUPPORT_LIBS + 'ws_endpoint');
				
			endpoint.callService(zenithMessage, option, function(err,message){		
					callback(null, message);		
			});	
				
				
				
		} else {
				//set the message body to the error message
				var errMsg = 'EPR value is not defined.'; 
				zenithMessage.body = soapErrorMsg.getSOAP11Fault(errMsg);
				callback(null, zenithMessage);
		}
		
		
	});
	
}