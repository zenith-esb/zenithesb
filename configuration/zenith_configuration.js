/**
 * this is the configuration file. message object has the message body in
 * message.body field. 
 * callback function should be called with the result. this result is sent
 * back to the request
 */

var logger = require('../lib/logger');
function mediate(message, callback){	

	
	var serviceURL = 'http://localhost:9000/service/EchoService';
	var pathName = message.transportHeaders.url.pathname;
	
	
	//direct proxy
	if(pathName === '/services/DirectProxy'){
		
		callWebService(message, serviceURL, callback)
	} 
	
	//CBR proxy
	
	
}
exports.mediate = mediate;

function callWebService(message, serviceURL, callback){
	
		var option = {
			url : serviceURL//'http://localhost:9000/services/SimpleStockQuoteService'
				//'http://localhost:9000/service/EchoService'
		};
			
		var endpoint = require('../lib/support/ws_endpoint');
		
		endpoint.callService(message, option, function(err,message){		
			callback(null, message);		
		});	
}

