/**
 * Super class for every transport. 
 */
var logger = require('../logger')
function Transport(config, messageFormatter){
	this.config = config;
	this.messageFormater = messageFormatter;
}

Transport.prototype.start = function(){
	logger.error('Transport', 'Abstract method start() is not implemented')
}
module.exports = Transport;