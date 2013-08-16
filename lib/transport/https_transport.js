/**
 * New node file
 */

var https = require('https');
var fs = require('fs');
var logger = require('../logger');
var transportProcess = require('./transport_process');
var Transport = require('./transport');

var ROOT = '././';
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
	var options = {
			key: fs.readFileSync(ROOT + this.config.key),
			cert: fs.readFileSync(ROOT + this.config.cert)
	};
	msgFormatter = this.messageFormater;
	
	https.createServer(options, function(req, resp){			
		//call the message formatter and wait for the process to finish. 
		transportProcess.viewServices(req, resp);
		transportProcess.formatMessage(req, resp, msgFormatter);
		
	}).listen(this.config.port);	
	
	logger.info('HttpsTransport', 'HTTPs transport started on port ' + this.config.port);
}


module.exports = HttpsTransport;