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
	
	
}
	
module.exports = MessageFormater;