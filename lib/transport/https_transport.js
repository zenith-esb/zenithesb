/**
 * New node file
 */

var logger = require('../logger');
var transportProcess = require('./transport_process');
var Transport = require('./transport');


var HttpsTransport = function(config, messageFormatter){
	Transport.call(this)
	this.config = config;
	this.messageFormater = messageFormatter;
};
HttpsTransport.prototype = new Transport();
HttpsTransport.prototype.constructor = HttpsTransport;

/**
 * method to start the transport. this implements
 *  the abstract method in Transport 
 */
HttpsTransport.prototype.start = function(){
	
	logger.info('HttpsTransport', 'HTTPs transport started on port ' + this.config.port);
}


module.exports = HttpsTransport;