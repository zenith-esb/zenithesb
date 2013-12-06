/**
 * this is the configuration file. message object has the message body in
 * message.body field. 
 * callback function should be called with the result. this result is sent
 * back to the request
 */
/*
var SAMPLE_NO = '5';
var logger = require('../lib/logger');
var samples = require('../samples/sample_' + SAMPLE_NO);
var fypDemo = require('../samples/fyp');
//var loadtest =  require('../samples/loadtest/loadtest');;
var sample =  require('../samples/sample_6');
*/
var SUPPORT_LIBS = '../lib/support/';
var XSLT_RES = './resources/xslt/';
var logger = require('../lib/logger');
var soapErrorMsg = require('../lib/util/errormsg/soap_err_msg');
var zenithErrorMsg = require('../lib/util/errormsg/zenith_err_msg');
var cbrRoute = require('../lib/support/cbr_route');
var endpoint = require(SUPPORT_LIBS + 'ws_endpoint');
var event = require(SUPPORT_LIBS + 'event');
var xslt = require(SUPPORT_LIBS + 'xml/xslt_processor');
var saxProcessor = require(SUPPORT_LIBS + 'xml/sax_processor');
var sample = require('./../samples/sample_6');



function mediate(message, callback){	

	//run the pre defined sample. see ./samples dir
	//samples.executeSample(message, callback);

	//run the load testing scenario
    sample.executeSample(message, callback);
	
	//fypDemoConfig(message, callback)
	
}
exports.mediate = mediate;

/**
 * final year demo configuration
 * @param zenithMessage
 * @param callback
 */
function fypDemoConfig(zenithMessage, callback){
	var reqUrl = zenithMessage.transportHeaders.url; //returns url object

	if(reqUrl.pathname === '/restservices/balance/'){
		/**
		 * Scenario for secure http connecton. The reqest is sent to
		 * a RESTful web service. Response is a text/xml. Here it is
		 * transformed to text/html
		 */
	
		var option = {
				url : 'http://localhost:9000/RESTServer/rest/balance'
			};
			
		var xsltFile = XSLT_RES + 'balance.xsl';
		
		endpoint.callService(zenithMessage, option, function(err,message){	
			
			//transform XML to HTML
			var transformedBckMsg = xslt.transformXML(message.body, xsltFile, []);
			message.body = transformedBckMsg;
			message.transportHeaders.headers['content-type'] = 'text/html';
			logger.debug('FYP DEMO', transformedBckMsg);
			
			handleResponse(err, message, callback);
					
			});	
		
		
	} else if(reqUrl.pathname === '/restservices/timetable/'){
		/**
		 * Scenario for ESB-to-ESB communication
		 */
		// request url for another ESB		
		var option = {
				url : 'http://localhost:9000/proxyesb/timetable'
			};	
		//call web service	
		endpoint.callService(zenithMessage, option, function(err,message){
			handleResponse(err, message, callback);
		});	
		
	} else if(reqUrl.pathname === '/axis2/services/SeatService'){
		/**
		 * Scenario for SOAP based web service access
		 */
		// request url for another ESB		
		var option = {
				url : 'http://192.168.105.1:9000/axis2/services/SeatService'
			};	
		//call web service	
		endpoint.callService(zenithMessage, option, function(err,message){
			handleResponse(err, message, callback);
		});	
		
	} else if(reqUrl.pathname === '/message/All'){
		
		topic = 'station.*';
		event.publish(topic, zenithMessage, callback);
		
	} else if(reqUrl.pathname === '/message/Fort'){
		
		topic = 'station.fort';
		event.publish(topic, zenithMessage, callback);
		
	} else if(reqUrl.pathname === '/message/Gampaha'){
		
		topic = 'station.gampaha';
		event.publish(topic, zenithMessage, callback);
		
	} else if(reqUrl.pathname === '/services/CBRProxy'){
		/**
		 * Configuration for CBR proxy load test scenario
		 */
		// request url for SOAP based web service	
		var option = {
				url : 'http://localhost:9000/RESTServer/rest/timetable'
			};	
		//CBR routing. Use SAX parser to check the message body	
		cbrRoute.CBRSOAPBodyRoute(zenithMessage.body, '//order/symbol','IBM', function(){
			
			endpoint.callService(zenithMessage, option, function(err,message){		
				handleResponse(err, message, callback);		
			});	
		});
		
		
	} else if(reqUrl.pathname === '/proxyesb/timetable'){		
		/**
		 * Configuration for the second ESB
		 */
		// request url for the real service behind the 2nd ESB	
		var option = {
				url : 'http://localhost:9000/RESTServer/rest/timetable'
			};	
		//call web service	
		endpoint.callService(zenithMessage, option, function(err,message){
			handleResponse(err, message, callback);
		});	
		
	} else {
		//handle invalid request
		var errMsg = soapErrorMsg.getSOAP11Fault('Invalid EPR value.'); 
		var errZenithMessage = zenithErrorMsg.getZenithErrorMSG(errMsg, 'text/xml', '500');
		callback(null, errZenithMessage);
	}
	
}
/**
 * handle error for web service connection 
 */
function handleResponse(err, message, callback){
	if(!err){
		
		callback(null, message);	
	} else {
		//send error message for error situation
		//can create more detailed errors by reading fields in 'err' object
		var errMsg = soapErrorMsg.getSOAP11Fault('Connection Refused.'); 
		var errZenithMessage = zenithErrorMsg.getZenithErrorMSG(errMsg, 'text/xml', '503');
		callback(null, errZenithMessage);
	}
}
