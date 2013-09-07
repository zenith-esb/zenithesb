/**
 * Factory to start the AMQP server and initialize it
 */

var amqpSubs = require('./amqp_subscribers');
var logger = require('../logger');

exports.initialize = function(){
	
	/**
	 * TODO get the configurations from local and 
	 * configure the consumers
	 */
	var isMessagingServerRunning = false;//init this after checking.
									// this is hard-coded
	
	if(isMessagingServerRunning){
		logger.info('MessagingFactory', ' Starting AMQP Messaging server....');
		amqpSubs.startSub();
		logger.info('MessagingFactory', ' AMQP Messaging server Started');
	} else {
		logger.info('MessagingFactory', ' AMQP Messaging server is not running');
	}
	
	
}