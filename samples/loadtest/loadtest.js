/**
 * New node file
 */
var SUPPORT_LIBS = '../../lib/support/';
var soapErrorMsg = require('../../lib/util/errormsg/soap_err_msg');
var zenithErrorMsg = require('../../lib/util/errormsg/zenith_err_msg');
var logger = require('../../lib/logger'); 



exports.executeTest = function(zenithMessage, callback){
	
	var serviceURL = 'http://192.168.0.1:9000/service/EchoService';//real service url
	var reqUrl = zenithMessage.transportHeaders.url; //returns url object

	if(reqUrl.pathname === '/services/DirectProxy'){
		//Direct Proxy Service
		directProxy(zenithMessage, serviceURL, callback);
		
	} else if((reqUrl.pathname === '/services/CBRProxy')){
		//Content Based Routing Proxy on SOAP body payload
		cbrProxy(zenithMessage, serviceURL, callback);
			
	} else if((reqUrl.pathname === '/services/CBRTransportHeaderProxy')){
		//Content Based Routing Proxy on Transport Header
		cbrTransportHeaderProxy(zenithMessage, serviceURL, callback);
		
	} else if(reqUrl.pathname === '/services/CBRSOAPHeaderProxy') {
		//Content Based Routing Proxy on SOAP header
		cbrSOAPHeaderProxy(zenithMessage, serviceURL, callback);
		
	} else if(reqUrl.pathname === '/services/XSLTProxy') {
		//XSLT Transformation Proxy
		xsltProxy(zenithMessage, serviceURL, callback);
		
	} else {
		//unknow request
		var errMsg = soapErrorMsg.getSOAP11Fault('Invalid EPR value.'); 
		var errZenithMessage = zenithErrorMsg.getZenithErrorMSG(errMsg, 'text/xml', '500');
		callback(null, errZenithMessage);
	}
	
	
}
/**
 * direct proxy
 * @param zenithMessage
 * @param serviceURL
 * @param callback
 */
function directProxy(zenithMessage, serviceURL, callback){
	
	var option = {
			url : serviceURL
		};
			
	var endpoint = require(SUPPORT_LIBS + 'ws_endpoint');
		
		endpoint.callService(zenithMessage, option, function(err,message){		
			callback(null, message);		
		});	
}

/**
 * Content Based Routing Proxy on SOAP body payload
 * @param zenithMessage
 * @param serviceURL
 * @param callback
 */
function cbrProxy(zenithMessage, serviceURL, callback){
	
}

/**
 * Content based routing on SOAP header
 * @param zenithMessage
 * @param serviceURL
 * @param callback
 */
function cbrSOAPHeaderProxy(zenithMessage, serviceURL, callback){
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
				var errMsg = soapErrorMsg.getSOAP11Fault('Message does not contain \'' + soapHeaderValue +'\'.'); 
				var errZenithMessage = zenithErrorMsg.getZenithErrorMSG(errMsg, 'text/xml', '400');
				callback(null, errZenithMessage);
			}
		}
		
	});
	
}

/**
 * Content based routing on transport header
 * @param zenithMessage
 * @param serviceURL
 * @param callback
 */
function cbrTransportHeaderProxy(zenithMessage, serviceURL, callback){

	var transportHeaderValue = 'xadmin;server1;community#1.0##';
	
	//if header has the correct routing value, call service
	if(zenithMessage.transportHeaders.headers['routing']
				=== transportHeaderValue){
		
		var option = {
				url : serviceURL
			};
				
		var endpoint = require(SUPPORT_LIBS + 'ws_endpoint');
			
		endpoint.callService(zenithMessage, option, function(err,message){		
				callback(null, message);		
			});		
		
		
	} else {
		//set the message body to the error message
		var errMsg = soapErrorMsg.getSOAP11Fault('Invalid routing header'); 
		var errZenithMessage = zenithErrorMsg.getZenithErrorMSG(errMsg, 'text/xml', '400');
		callback(null, errZenithMessage);
	}
}

/**
 * XSLT proxy
 * @param zenithMessage
 * @param serviceURL
 * @param callback
 */
function xsltProxy(zenithMessage, serviceURL, callback){
	var XSLT_RES = './resources/xslt/';
	logger.debug('SampleConfig', 'EPR: ' + serviceURL);

	var option = {
		url : serviceURL
	};

	var endpoint = require(SUPPORT_LIBS + 'ws_endpoint');
	var xslt = require(SUPPORT_LIBS + 'xml/xslt_processor');
	var saxProcessor = require(SUPPORT_LIBS + 'xml/sax_processor');
	
	//files for transforming and transforming back the requests and responses respectively.
	var xsltFile = XSLT_RES + 'transform_env_reverse.xslt';
	var xsltFile_back = XSLT_RES + 'transform_env.xslt';
	
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
					logger.debug('XSLTProxy','Response :'+transformedBckSOAP);
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
	

}
