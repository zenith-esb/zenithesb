/**
 * HTTP transport listner
 */
var http = require('http');
var logger = require('../logger');
var transportProcess = require('./transport_process');

var HttpTransport = function(config, messageFormatter){
	
	/**
	 * public method to start the transport listner
	 */
	this.start = function(){
		
		statServer();		
		logger.info('HTTPTransport', 'http transport started on port ' + config.port);
	};
	function statServer(){
		
		http.createServer(function(req, resp){			
			//call the message formatter and wait for the process to finish. 
			transportProcess.viewServices(req, resp);
			transportProcess.formatMessage(req, resp, messageFormatter);
		}).listen(config.port);		
	}
};

module.exports = HttpTransport;