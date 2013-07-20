/**
 * Super class for every transport. 
 */
var logger = require('../logger')

/**
 * constructor for the parent object
 * @param config
 * @param messageFormatter
 * @returns
 */
function Transport(config, messageFormatter){
	this.config = config;
	this.messageFormater = messageFormatter;
}

/**
 * abstract method to start the transport
 */
Transport.prototype.start = function(){
	logger.error('Transport', 'Abstract method start() is not implemented')
}
module.exports = Transport;