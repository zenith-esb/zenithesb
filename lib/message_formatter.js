/**
 * Handle message related tasks
 */

var url = require('url');
var logger = require('./logger');
var msgBuilder = require('./message_builder');
var CONFIG_FILE_PATH = '../configuration/zenith_configuration';
var sequenceHandler = require('./sequence_handler');
var MessageFormater = function(){
	
	this.process= function(request,response, callback){
		
		//create message object
		var zenithMessage;
		var builder = msgBuilder.buildMessage(request, function(result){
			zenithMessage = result;
			
			//pass for processing
			sequenceHandler.startSequence(zenithMessage, function(err, reply){
				
				if(!err){
					msgBuilder.buildResponse(zenithMessage,request, response, function(err,final_resp){
					
						if(!err){
							callback(null, final_resp);
						} else {
							logger.error('MessageBuilder', err.message);
						}
						
					});					
				} else {					
					logger.error('SequenceHandler', err.message);
				}
			});			
		});
		
		
	};
	
	this.format = function(req, callback){
		
		//object that holds the message and related data
		var message = {} ;
		
		
		//things in the request object
		var parsedURL = url.parse(req.url, true);
		
		//every thing should be passed to the option from the request
        var transportHeaders = {
        		
        		method: req.method,    
        		headers: req.headers,
        		url : parsedURL        		
        		
        }
        
        //set the headers from the transport to the message object
        message.transportHeaders = transportHeaders;
        
		//extract the body of the message
		var body;      
        req.on('data', function (chunk) {
        	//set the message body with the request's body
        	body = body + chunk;
        	logger.debug('MessageFormatter', 'Request : ' + chunk + '');
        });
       
        //after doing the message extraction go to next step
		req.on('end', function(){
			 message.body = body;
			//call the message sequence method. this is in the config file
			var sequence = require(CONFIG_FILE_PATH);
			sequence.mediate(message, function(err,chunk){
				//send reply back to the transport handler
				callback(null, chunk);
				
			});					
		
		})
	
	}
}
	
module.exports = MessageFormater;