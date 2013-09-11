/**
 * Factory to start the AMQP server and initialize it
 */
var amqp = require('amqp');
var amqpSubs = require('./amqp_subscribers');
var logger = require('../logger');
var http = require('http');

var serverConfig = require('../../configuration/server_config').amqp;
var eventSubs = require('../../configuration/event_config').eventSubscribers;
exports.initialize = function(){
	
	/**
	 * TODO get the configurations from local and 
	 * configure the consumers
	 */
	var isMessagingServerRunning = true;//serverConfig.status;
	
	
	if(isMessagingServerRunning === true){
		logger.info('MessagingFactory', ' Starting AMQP Messaging server....');
		
		var connection = amqp.createConnection(serverConfig.server);
		amqpSubs.startSub(connection, eventSubs);
		logger.info('MessagingFactory', ' AMQP Messaging server Started');
	} else {
		logger.info('MessagingFactory', ' AMQP Messaging server is not running');
	}
	
	
}