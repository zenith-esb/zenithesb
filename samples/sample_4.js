/**
 * Scenario where asynchronous messaging is used. event.publish()
 * publish message to AMQP queue related to the given topic. message 
 * delivery to the subscribers is handled internally by Zenith ESB.
 * (AMQP messaging server is needed. tested with RabbitMQ)  
 */

var SUPPORT_LIBS = '../lib/support/';
var logger = require('../lib/logger');
//var soapErrorMsg = require('../lib/util/errormsg');

var event = require(SUPPORT_LIBS + 'event');
exports.executeSample = function(zenithMessage, callback){

	var topic = 'com.chamila';
	event.publish(topic, zenithMessage, callback);

}