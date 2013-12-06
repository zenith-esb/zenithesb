/**
 * This creates transports defined by the user 
 */
var serverConfig = require('../../configuration/server_config').transports;
var logger = require('../logger');
var TRANSPORT_PATH = './';

/**get the transports 
 * @returns array of transports  
 */
exports.getTransport = function(messageFormatter){
	logger.info('TransportFactory', 'Starting transport initilization...');
	//array of transports
	var transports = [];
	var tempTransport;
	var moduleName;
	
	//transport object
	var Module;
	//configurations for the transport module
	var moduleConfig;
	
	//for all the transports defined in server_config.json
	for(x in serverConfig){
		
		moduleName = serverConfig[x].module;		
		moduleConfig = serverConfig[x].config;
		logger.info('TransportFactory', 'Initilizing '+ moduleName );
		//import the correct transport module using the module name
		//module name is similar to the js module in transport folder
		Module = require(TRANSPORT_PATH + moduleName);
		//instanciate module
		tempTransport = new Module(moduleConfig, messageFormatter);
		//put it in to a queue
		transports.push(tempTransport);
	}
	
	return transports;
}
