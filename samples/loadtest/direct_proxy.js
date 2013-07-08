/**
 * Sample configuration for direct proxy scenario
 * WSDL file should be added to resources/wsdl.
 * add the name of the WSDL and the service name
 * to  configuration/service_config.json
 */

var logger = require('../../../lib/logger'); 

exports.doMediation = function(zenithMessage, callback){
	
	var serviceURL = 'http://localhost:9000/service/EchoService';
	var pathName = zenithMessage.transportHeaders.url.pathname;
	
	
	//direct proxy
	if(pathName === '/services/DirectProxy'){
		
		var option = {
				url : serviceURL//'http://localhost:9000/services/SimpleStockQuoteService'
					//'http://localhost:9000/service/EchoService'
			};
				
			var endpoint = require('../../../lib/support/ws_endpoint');
			
			endpoint.callService(zenithMessage, option, function(err,message){		
				callback(null, message);		
			});	
	} 
	
	
	
};