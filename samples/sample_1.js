/**
 * Message Proxy scenario. Send the message to the user defined
 * serviceURL address.
 */

var SUPPORT_LIBS = '../lib/support/';
var logger = require('../lib/logger');


exports.executeSample = function(zenithMessage, callback){
	var reqUrl = zenithMessage.transportHeaders.url; //returns url object

	if(reqUrl.pathname === '/services/StockQuoteProxy'){
		
		var serviceURL = 'http://localhost:9000/services/SimpleStockQuoteService';
		logger.debug('SampleConfig', 'EPR: ' + serviceURL);
		
		var option = {
				url : serviceURL
			};
				
		var endpoint = require(SUPPORT_LIBS + 'ws_endpoint');
			
		endpoint.callService(zenithMessage, option, function(err,message){		
				callback(null, message);		
			});	
		
	}
	
}