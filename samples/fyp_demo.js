/**
 * Message Proxy scenario. Send the message to the user defined
 * serviceURL address.
 */

var SUPPORT_LIBS = '../lib/support/';
var logger = require('../lib/logger');
var soapErrorMsg = require('../lib/util/errormsg/soap_err_msg');
var zenithErrorMsg = require('../lib/util/errormsg/zenith_err_msg');
var XSLT_RES = './resources/xslt/';
var xslt = require(SUPPORT_LIBS + 'xml/xslt_processor');
var saxProcessor = require(SUPPORT_LIBS + 'xml/sax_processor');

exports.executeSample = function(zenithMessage, callback){
	var reqUrl = zenithMessage.transportHeaders.url; //returns url object

	if(reqUrl.pathname === '/restservices/balance/'){
		/**
		 * Scenario for secure http connecton
		 */
		var serviceURL = 'http://localhost:9000/RESTServer/rest/balance';
		
		logger.debug('SampleConfig', 'EPR: ' + serviceURL);
		
		var option = {
				url : serviceURL
			};
				
		var endpoint = require(SUPPORT_LIBS + 'ws_endpoint');
		
		var xsltFile = XSLT_RES + 'balance.xsl';
		
		endpoint.callService(zenithMessage, option, function(err,message){		
			if(!err){
				
				var transformedBckMsg = xslt.transformXML(message.body, xsltFile, []);
				message.body = transformedBckMsg;
				message.transportHeaders.headers['content-type'] = 'text/html';
				logger.debug('FYP DEMO', transformedBckMsg);
				callback(null, message);	
			} else {
				//send error message for error situation
				//can create more detailed errors by reading fields in 'err' object
				var errMsg = soapErrorMsg.getSOAP11Fault('Connection Refused.'); 
				var errZenithMessage = zenithErrorMsg.getZenithErrorMSG(errMsg, 'text/xml', '503');
				callback(null, errZenithMessage);
			}		
			});	
		
	} else if(reqUrl.pathname === '/restservices/timetable/'){
		/**
		 * Scenario for ESB-to-ESB communication
		 */
		// request url for another ESB
		var serviceURL = 'http://localhost:9000/RESTServer/rest/timetable';
		logger.debug('SampleConfig', 'EPR: ' + serviceURL);
		
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
		var errMsg = soapErrorMsg.getSOAP11Fault('Invalid EPR value.'); 
		var errZenithMessage = zenithErrorMsg.getZenithErrorMSG(errMsg, 'text/xml', '500');
		callback(null, errZenithMessage);
	}
	
}
