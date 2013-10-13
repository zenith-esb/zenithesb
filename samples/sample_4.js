/**
 * Scenario where asynchronous messaging is used. event.publish()
 * publish message to AMQP queue related to the given topic. message 
 * delivery to the subscribers is handled internally by Zenith ESB.
 * (AMQP messaging server is needed. tested with RabbitMQ)  
 */

var SUPPORT_LIBS = '../lib/support/';
var logger = require('../lib/logger');
var soapErrorMsg = require('../lib/util/errormsg/soap_err_msg');

var event = require(SUPPORT_LIBS + 'event');
exports.executeSample = function(zenithMessage, callback){

	var topic; //= '09.cse.uom';
	//event.publish(topic, zenithMessage, callback);
	
	var reqUrl = zenithMessage.transportHeaders.url; //returns url object

	if(reqUrl.pathname === '/message/All'){
		
		topic = 'station.*';
		event.publish(topic, zenithMessage, callback);
		
	} else if(reqUrl.pathname === '/message/Fort'){
		
		topic = 'station.fort';
		event.publish(topic, zenithMessage, callback);
		
	} else if(reqUrl.pathname === '/message/Gampaha'){
		
		topic = 'station.gampaha';
		event.publish(topic, zenithMessage, callback);
		
	} else if(reqUrl.pathname === '/axis2/services/SeatService'){
		
		var serviceURL = 'http://192.168.105.1:9000/axis2/services/SeatService';
		logger.debug('SampleConfig', 'EPR: ' + serviceURL);
		
		var option = {
				url : serviceURL
			};
				
		var endpoint = require(SUPPORT_LIBS + 'ws_endpoint');
			
		endpoint.callService(zenithMessage, option, function(err,message){		
				callback(null, message);		
			});	
		
	} else {
		
		var errMsg = 'Invalid EPR value.'; 
		zenithMessage.body = soapErrorMsg.getSOAP11Fault(errMsg);
		callback(null, zenithMessage);
	}
		

}