/**
 * Sample configuration for direct proxy scenario
 * WSDL file should be added to resources/wsdl.
 * add the name of the WSDL and the service name
 * to  configuration/service_config.json
 */
var SUPPORT_LIBS = '../../lib/support/';
var logger = require('../../lib/logger'); 

exports.executeTest = function(zenithMessage, callback){
	
	var serviceURL = 'http://localhost:9000/service/EchoService';
	var pathName = zenithMessage.transportHeaders.url.pathname;
	
	
	//direct proxy
	if(pathName === '/services/DirectProxy'){
		
		var option = {
				url : serviceURL
			};
				
		var endpoint = require(SUPPORT_LIBS + 'ws_endpoint');
			
			endpoint.callService(zenithMessage, option, function(err,message){		
				callback(null, message);		
			});	
	} 
	
	
	
};