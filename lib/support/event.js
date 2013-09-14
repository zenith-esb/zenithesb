/**
 * module to generate and publish events.
 */

var amqp = require('amqp');
var logger = require('../logger');
var EXCHANGE = 'zenith-exchange';
var http = require('http');
var url = require('url');
var string = require('string');

var eventSubscribers = require('../../configuration/event_config').eventSubscribers;
exports.publish = function(topic, zenithMessage, callback){
	/*
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
	*/
	 var l = 0;
	  for( var i = 0; i < eventSubscribers.length; i++){
		  
			    // Catch all messages
			  var entry =  eventSubscribers[l++];
			  	
			 // logger.debug('AMQPServer', ' Binding ' + itm[l++]);
			    //q.bind(EXCHANGE, entry.bindingKey);

			    // Receive messages
			// if(entry.bindingKey === topic){
			  if(string(entry.bindingKey).contains(topic)){
				 logger.debug('AMQPServer', ' Binding ' + entry.bindingKey);
			    	var subs = entry.subscribers;
			    	logger.debug('AMQPServer', 'Number of subscribers :' + subs.length);
					for( j = 0; j < subs.length; j++){
					
					    logger.info('AMQPServer', ' Pattern '+ entry.bindingKey +
					    		' - Publish to ' + subs[j] );
					  	publishToSub(zenithMessage, subs[j]);
					}
			     
			 }
		
		 
	  }
	 
	
	/**
	 * TODO change this. check whether we need to send a reply back
	 */
	//zenithMessage.body = "Done";
	zenithMessage.transportHeaders.statusCode = 200;
	//zenithMessage.contentType = 'text/plain';
	callback(null,zenithMessage);
	
};

function publishToSub(message, subUrl){
	
		
	    var parseURL = url.parse(subUrl);	
	    var wsOptions={
				hostname : parseURL.hostname,
				path : parseURL.path,
				port : parseURL.port,
				method : message.transportHeaders.method,
				agent: false
			}; 
	 
		var wsRequest = http.request(wsOptions, function(wsResponse) {
				
				wsResponse.on('end', function() {				
					logger.info('AMQPServer', ' Published to ' + subUrl)
				});
				
			});
			
			wsRequest.on('error', function(er){		
				logger.error('WSEndPoint', ' ' +subUrl+' unreachable: ' + er.message);				
			});
			
			wsRequest.write(message.body);
			wsRequest.end();	
	
	
}

