/**
 * New node file
 */
var SUPPORT_LIBS = '../../lib/support/';
var soapErrorMsg = require('../../lib/util/errormsg/soap_err_msg');
var zenithErrorMsg = require('../../lib/util/errormsg/zenith_err_msg');
var logger = require('../../lib/logger'); 



exports.executeTest = function(zenithMessage, callback){
	
	var serviceURL = 'http://localhost:9000/service/EchoService';//real service url
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
		var errMsg = oapErrorMsg.getSOAP11Fault('Invalid EPR value.'); 
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
				var errMsg = oapErrorMsg.getSOAP11Fault('Message does not contain \'' + soapHeaderValue +'\'.'); 
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
		var errMsg = oapErrorMsg.getSOAP11Fault('Invalid routing header'); 
		var errZenithMessage = zenithErrorMsg.getZenithErrorMSG(errMsg, 'text/xml', '400');
		callback(null, errZenithMessage);
	}
}

function xsltProxy(zenithMessage, serviceURL, callback){
	
}