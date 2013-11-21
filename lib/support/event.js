/**
 * module to generate and publish events.
 */

var amqp = require('amqp');
var logger = require('../logger');
var EXCHANGE = 'zenith-exchange';
var http = require('http');
var url = require('url');
var string = require('string');
var amqpFactory = require('../../lib/amqp/messaging_factory');

var serverConfig = require('../../configuration/server_config').amqp;
var eventSubscribers = require('../../configuration/event_config').eventSubscribers;
exports.publish = function(topic, zenithMessage, callback){
	
	var connection = amqp.createConnection(serverConfig.server);// amqpFactory.getConnection();
	if(connection == null){
		logger.error('Event', ' Connection error!');
		zenithMessage.body = "Service unavailable";
		zenithMessage.transportHeaders.statusCode = 503;
		callback('connection error', zenithMessage);
		return;
	}
	connection.on('ready', function(){
		
		var exc = connection.exchange(EXCHANGE ,{type: 'topic', confirm: true}, function (exchange) {
			  logger.info('Event',' Publish event on topic ' + topic);
			  
			  pubOpt = null;//{contentEncoding: 'utf8'  };
			 var conf =  exc.publish(topic, {data:zenithMessage}, pubOpt,function(){
				 console.log('ddd' );  
				 
			  });
			 
			  // confirmation is not working
			  
			 conf.on('ack', function(){
				 console.log('recieved ack');
				 connection.end();
			 })
			  
		});
		
	});
	connection.on('error', function(err){
		console.log('-------errrrrrrr------');
	})
	
	/**
	 * TODO change this. check whether we need to send a reply back
	 */
	//zenithMessage.body = "Done";
	zenithMessage.transportHeaders.statusCode = 200;
	//zenithMessage.contentType = 'text/plain';
	callback(null,zenithMessage);
	
};