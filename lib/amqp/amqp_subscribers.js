/**
 * Module to publish message in the AMQP queues to the subscribers
 */
var amqp = require('amqp');
var http = require('http');
var url = require('url');
var logger = require('../logger');

var EXCHANGE = 'zenith-exchange';
//var subUrl = 'http://192.168.105.101:9999/message';//'http://localhost:9000/services/SimpleStockQuoteService';
//var routingPattern = '#';

var connection;// = amqp.createConnection({ host: 'localhost' });
var eventSubscribers;
exports.startSub = function(con, subs){
	// Wait for connection to become established.
	connection = con;
	eventSubscribers = subs;
	connection.on('ready', function () {

		var exc = connection.exchange( EXCHANGE,{type: 'topic', confirm: true}, function (exchange) {
			  logger.info( 'AMQPServer',' Exchange ' + exchange.name + ' is open');	  
			/*
			  for( i = 0; i < eventSubscribers.length; i++){
					//console.log(eventSubscribers[i].bindingKey);
					connection.queue('', function(q){
					    // Catch all messages
						logger.debug('AMQPServer', ' Binding ' + eventSubscribers[i].bindingKey);
					    q.bind(EXCHANGE, eventSubscribers[i].bindingKey);

					    // Receive messages
					    q.subscribe(function (message, headers, deliveryInfo) {

					    	var subs = eventSubscribers[i].subscribers;
							for( j = 0; j < subs.length; j++){
							
							    logger.info('AMQPServer', ' Pattern '+ routingPattern + ' - Publish to ' + subs[j] );
							  	publishToSub(message.data, subs[j]);
							}
					     
					    });
					});
					
					
				} */
			  /*
				connection.queue('', function(q){
				    // Catch all messages
				    q.bind(EXCHANGE, routingPattern);

				    // Receive messages
				    q.subscribe(function (message, headers, deliveryInfo) {

				      logger.info('AMQPServer', ' Pattern '+ routingPattern + ' - Publish to ' + subUrl );
				  	  publishToSub(message.data, subUrl);
				    });
				});
				
			  */
		
			  connection.queue('', function(q){
				    // Catch all messages
					logger.debug('AMQPServer', ' Binding ' + eventSubscribers[0].bindingKey);
				    q.bind(EXCHANGE, eventSubscribers[0].bindingKey);

				    // Receive messages
				    q.subscribe(function (message, headers, deliveryInfo) {

				    	var subs = eventSubscribers[0].subscribers;
						for( j = 0; j < subs.length; j++){
						
						    logger.info('AMQPServer', ' Pattern '+ eventSubscribers[0].bindingKey +
						    		' - Publish to ' + subs[j] );
						  	publishToSub(message.data, subs[j]);
						}
				     
				    });
				});
				
			  
		});


	});
}

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
