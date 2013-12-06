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
			  logger.info( 'AMQPServer',' Exchange ' + exchange.name + ' is open ------');	  
			  			 
			  var l = 0;
			  for( var i = 0; i < eventSubscribers.length; i++){
				  connection.queue('', function(q){
					    // Catch all messages
					  var entry =  eventSubscribers[l++];
					  	logger.debug('AMQPServer', ' Binding ' + entry.bindingKey);
					 // logger.debug('AMQPServer', ' Binding ' + itm[l++]);
					    q.bind(EXCHANGE, entry.bindingKey);
					  	//q.bind(EXCHANGE, '#');

					    // Receive messages
					    q.subscribe(function (message, headers, deliveryInfo) {

					    	var subs = entry.subscribers;
					    	logger.debug('AMQPServer', 'Number of subscribers :' + subs.length);
							for( j = 0; j < subs.length; j++){
							//send messages to all the subscribers
							    logger.info('AMQPServer', ' Pattern '+ entry.bindingKey +
							    		' - Publish to ' + subs[j] );
							  	publishToSub(message.data, subs[j]);
							}
					     
					    });
					});
				 
			  }
			  

			

		});


	});
}

/**
* publish message to a single user
* @param message message from the amqp queue
* @param subUrl subscriber's url
*/
function publishToSub(message, subUrl){
	
		
	    var parseURL = url.parse(subUrl);	
		//endpoint info
	    var wsOptions={
				hostname : parseURL.hostname,
				path : parseURL.path,
				port : parseURL.port,
				method : message.transportHeaders.method,
				agent: false
			}; 
	 	//open a http connection and send it to the listner
		var wsRequest = http.request(wsOptions, function(wsResponse) {
				
				wsResponse.on('end', function() {				
					logger.info('AMQPServer', ' Published to ' + subUrl)
				});
				
			});
			
			wsRequest.on('error', function(er){		
				logger.error('WSEndPoint', ' ' +subUrl+' unreachable: ' + er.message);				
			});
			//write message body
			wsRequest.write(message.body);
			wsRequest.end();	
	
	
}
