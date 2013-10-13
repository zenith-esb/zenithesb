/**
 * Factory to start the AMQP server and initialize it
 */
var amqp = require('amqp');
var amqpSubs = require('./amqp_subscribers');
var logger = require('../logger');
var http = require('http');

var serverConfig = require('../../configuration/server_config').amqp;
var eventSubs = require('../../configuration/event_config').eventSubscribers;
var connection = null;
exports.initialize = function(){
	
	/**
	 * TODO get the configurations from local and 
	 * configure the consumers
	 */
	var isMessagingServerRunning = serverConfig.status;
	
	
	if(isMessagingServerRunning === 'true'){
		logger.info('MessagingFactory', ' Starting AMQP Messaging server....');
		
		connection = amqp.createConnection(serverConfig.server);
		connection.on('error', function(err){
			logger.error('MessagingFactory', 'Connection to the AMQP server failed!!.' +
					'Attempting to reconnect.....');
		});
		
		amqpSubs.startSub(connection, eventSubs);
		logger.info('MessagingFactory', ' AMQP Messaging server Started');
	} else if(isMessagingServerRunning === 'false'){
		logger.info('MessagingFactory', ' AMQP Messaging server is not running');
	} else {
		logger.error('MessagingFactory', ' Syntax error. Check the variable \'amqp.status\' in \'server_config.json\'');
	}
	
	
}
/**
 * create a new connection to the amqp server
 */
exports.getConnection = function (){
	
	/**
	 * TODO Try to use same connection for the above method.
	 */
	if(connection != null){
		return connection;
	} else {
		var isMessagingServerRunning = serverConfig.status;
		
		
		if(isMessagingServerRunning === 'true'){
			logger.info('MessagingFactory', ' Starting AMQP Messaging server....');
			
			connection = amqp.createConnection(serverConfig.server);
			connection.on('error', function(err){
				logger.error('MessagingFactory', 'Connection to the AMQP server failed!!.' +
						'Attempting to reconnect.....');
			});

			logger.info('MessagingFactory', ' AMQP Messaging server Started');
		} else if(isMessagingServerRunning === 'false'){
			logger.info('MessagingFactory', ' AMQP Messaging server is not running');
		
		} else {
			logger.error('MessagingFactory', ' Syntax error. Check the variable \'amqp.status\' in \'server_config.json\'');
		}
		
		return connection;
	}
}