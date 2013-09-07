/**
 * Module to publish message in the AMQP queues to the subscribers
 */
var amqp = require('amqp');
var http = require('http');
var url = require('url');
var logger = require('../logger');

var EXCHANGE = 'zenith-exchange';
var subUrl = 'http://localhost:9000/services/SimpleStockQuoteService';
var routingPattern = '*.chamila';

var connection = amqp.createConnection({ host: 'localhost' });

exports.startSub = function(){
	// Wait for connection to become established.
	connection.on('ready', function () {

		var exc = connection.exchange( EXCHANGE,{type: 'topic', confirm: true}, function (exchange) {
			  logger.info( 'AMQPServer',' Exchange ' + exchange.name + ' is open');	  
			  /*
			  connection.queue('', function(q){
				    // Catch all messages
					  //two binding keys for same key 
				    q.bind(EXCHANGE, '*.adhi');	
				    q.bind(EXCHANGE, '*.www');
				    // Receive messages
				    q.subscribe(function (message, headers, deliveryInfo) {
				      // Print messages to stdout
				  	 //console.log(message + ' : ' + deliveryInfo);
				  	  console.log('from *.adhi - ' + message.data.body );
				    }); 
				}); */
				//different binding for new queue
				connection.queue('', function(q){
				    // Catch all messages
				    q.bind(EXCHANGE, routingPattern);

				    // Receive messages
				    q.subscribe(function (message, headers, deliveryInfo) {

				      logger.info('AMQPServer', ' Pattern '+ routingPattern + ' - Publish to ' + subUrl );
				  	  publishToSub(message.data, subUrl);
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
				logger.error('WSEndPoint', ' Problem with request: ' + er.message);				
			});
			
			wsRequest.write(message.body);
			wsRequest.end();	
	
	
}
