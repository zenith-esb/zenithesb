/**
 * module to generate and publish events.
 */
var amqp = require('amqp');
var connection = amqp.createConnection({ host: 'localhost' });

exports.publish = function(topic, options, message, callback){
	
	connection.on('ready', function(){
		
		var exc = connection.exchange('my-exchange',{type: 'topic', confirm: true}, function (exchange) {
			  console.log('Exchange ' + exchange.name + ' is open');
			  
			  pubOpt = {contentEncoding: 'utf8'
					  
					  };
			 var conf =  exc.publish('com.chamila', {data:'testing message'}, pubOpt,function(){
				 console.log('ddd' );  
				 
			  });
			 /**
			  * confirmation is not working
			  */
			 conf.on('ack', function(){
				 console.log('recieved ack');
				 connection.end();
			 })
			  
		});
		
	});
	
}