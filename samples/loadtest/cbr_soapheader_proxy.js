/**
 * Sample configuration for CBRHeader proxy scenario
 * WSDL file should be added to resources/wsdl.
 * add the name of the WSDL and the service name
 * to  configuration/service_config.json
 */
var SUPPORT_LIBS = '../../lib/support/';
var soapErrorMsg = require('../../lib/util/errormsg/soap_err_msg');
var logger = require('../../lib/logger'); 

exports.executeTest = function(zenithMessage, callback){
	
	var serviceURL = 'http://localhost:9000/service/EchoService';
	
	var soapHeaderElement = 'routing';
	var soapHeaderElementNmSpcURI = 'http://someuri';
	var soapHeaderValue = 'xadmin;server1;community#1.0##';
	
	var saxProcessor = require(SUPPORT_LIBS + 'xml/sax_processor');
	
	saxProcessor.getElementValue(zenithMessage.body, 
			soapHeaderElementNmSpcURI, soapHeaderElement, function(err, value){
		logger.debug('CBRSOAPHeaderProxy', 'return val: ' + value[0]);
		
		if(err == null){ // no error		
			//if header has the correct routing value, call service
			if(value[0] === soapHeaderValue){
				var option = {
						url : serviceURL
					};
						
				var endpoint = require(SUPPORT_LIBS + 'ws_endpoint');
					
					endpoint.callService(zenithMessage, option, function(err,message){		
						callback(null, message);		
					});	
				
				
				
			} else {
				//set the message body to the error message
				var errMsg = 'Invalid routing header'; 
				zenithMessage.body = soapErrorMsg.getSOAP11Fault(errMsg);
				callback(null, zenithMessage);
			}
		}
		
	});
	
};