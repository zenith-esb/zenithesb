/**
 * Message mediation scenario. Send the message defined in the SOAP
 * WS-Addressing EPR value.
 */

var SUPPORT_LIBS = '../lib/support/';
var logger = require('../lib/logger');

exports.executeSample = function(zenithMessage, callback){
	//@TODO path name should be extracted from the SOAP header
	var serviceURL = 'http://localhost:9000/services/SimpleStockQuoteService';
	logger.debug('SampleConfig', 'EPR: ' + serviceURL);
	
	var pathName = zenithMessage.transportHeaders.url.pathname;
	
	var option = {
			url : serviceURL
		};
			
	var endpoint = require(SUPPORT_LIBS + 'ws_endpoint');
		
	endpoint.callService(zenithMessage, option, function(err,message){		
			callback(null, message);		
		});	
}