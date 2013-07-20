/**
 * HTTP transport listner
 */
var http = require('http');
var logger = require('../logger');
var transportProcess = require('./transport_process');
var Transport = require('./transport');


var HttpTransport = function(config, messageFormatter){
	Transport.call(this)
	this.config = config;
	this.messageFormater = messageFormatter;
};
HttpTransport.prototype = new Transport();
HttpTransport.prototype.constructor = HttpTransport;

/**
 * method to start the transport. this implements
 *  the abstract method in Transport 
 */
HttpTransport.prototype.start = function(){
	msgFormatter = this.messageFormater;
	
	http.createServer(function(req, resp){			
		//call the message formatter and wait for the process to finish. 
		transportProcess.viewServices(req, resp);
		transportProcess.formatMessage(req, resp, msgFormatter);
		
	}).listen(this.config.port);		
	
	logger.info('HTTPTransport', 'HTTP transport started on port ' + this.config.port);
}


module.exports = HttpTransport;