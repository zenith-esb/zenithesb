/**
 * XSLTProxy - transform the soap body so that the service can understand 
 * the request and client the response
 */

var SUPPORT_LIBS = '../../lib/support/';
var XSLT_RES = './resources/xslt/';
var logger = require('../../lib/logger');
var soapErrorMsg = require('../../lib/util/errormsg/soap_err_msg');
var zenithErrorMsg = require('../../lib/util/errormsg/zenith_err_msg');

exports.executeTest = function(zenithMessage, callback) {
	
	var reqUrl = zenithMessage.transportHeaders.url; // returns url object
	var serviceURL = 'http://localhost:9000/service/EchoService';
	
	if (reqUrl.pathname === '/services/XSLTProxy') {
		
		logger.debug('SampleConfig', 'EPR: ' + serviceURL);

		var option = {
			url : serviceURL
		};

		var endpoint = require(SUPPORT_LIBS + 'ws_endpoint');
		var xslt = require(SUPPORT_LIBS + 'xml/xslt_processor');
		var saxProcessor = require(SUPPORT_LIBS + 'xml/sax_processor');
		
		//files for transforming and transforming back the requests and responses respectively.
		var xsltFile = XSLT_RES + 'transform_env.xslt';
		var xsltFile_back = XSLT_RES + 'transform_env_reverse.xslt';
		
		//transform soap body to something that the real service can understand
		var transformedMsg = xslt
				.transformXML(zenithMessage.body, xsltFile, []);
		
		// create the soap message using original soap headers and transformed soap body
		saxProcessor.getTransformedSOAP(zenithMessage.body, transformedMsg, function(err, transformedSOAP){
			
			zenithMessage.body = transformedSOAP;
			endpoint.callService(zenithMessage, option, function(err, message) { 
				
				if(!err){
					// transformed the response so that the client can understand the format.
					var transformedBckMsg = xslt.transformXML(message.body, xsltFile_back, []);
			
					saxProcessor.getTransformedSOAP(message.body, transformedBckMsg, function(err, transformedBckSOAP){
						message.body = transformedBckSOAP;
						callback(null, message);
					});
					
				} else {
					//send error message for external web service error
					//can create more detailed errors by reading fields in 'err' object
					var errMsg = soapErrorMsg.getSOAP11Fault('Connection Refused.'); 
					var errZenithMessage = zenithErrorMsg.getZenithErrorMSG(errMsg, 'text/xml', '503');
					callback(null, errZenithMessage);
				}
				
			});
		});
		

	} else {
		
		var errMsg = oapErrorMsg.getSOAP11Fault('Invalid EPR value.'); 
		var errZenithMessage = zenithErrorMsg.getZenithErrorMSG(errMsg, 'text/xml', '500');
		callback(null, errZenithMessage);

	}

};