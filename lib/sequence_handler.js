/**
 * Passing message to the message processing
 * sequences. theerror handling sequence is
 * handled from here
 */

var sequence = require('../configuration/zenith_configuration');		
/**
 * start the message processing sequence defined in the 
 * zenith_configuration file
 */
exports.startSequence = function(message, callback){
	sequence.mediate(message, function(err,message){
		//send reply back to the transport handler
		callback(null, message);
		
	});	
	
}