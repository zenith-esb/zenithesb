/**
 * module to generate and publish events.
 */

var amqp = require('amqp');
var logger = require('../logger');
var EXCHANGE = 'zenith-exchange';

exports.publish = function(topic, zenithMessage, callback){
	
	var connection = amqp.createConnection({ host: 'localhost' });
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
	
	/**
	 * TODO change this. check whether we need to send a reply back
	 */
	//zenithMessage.body = "Done";
	zenithMessage.transportHeaders.statusCode = 200;
	//zenithMessage.contentType = 'text/plain';
	callback(null,zenithMessage);
	
};
