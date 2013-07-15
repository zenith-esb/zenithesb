/**
 * Entry point for the Zenith ESB
 */
var cluster = require('cluster')
var logger = require('./lib/logger');
var MessageFormatter = require('./lib/message_formatter');
var messageFormatter = new MessageFormatter();
var serverConfig = require('./configuration/server_config');
var TRANSPORT_PATH = './lib/transport/';
/*
 * read the server_config.json file and check for the type of 
 * transport handlers and their configurations. create a loop
 * or some thing and start them. pass the sequenceHandler to them
 */

/*
 * following part is hard coded to recieve http requests
 */


//Code to run if we're in the master process
if (cluster.isMaster) {
  // Count the machine's CPUs
	logger.info('Zenith', 'Starting Zenith ESB .....');
    var cpuCount = require('os').cpus().length;
    logger.info('Zenith', 'Starting process(es) on ' + cpuCount +
    		' core(s)');
    		
    // Create a worker for each CPU
    for (var i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }

    // Listen for dying workers
    cluster.on('exit', function (worker) {

        // Replace the dead worker,
    	logger.info('Zenith', 'Worker ' + worker.id + ' died');
    	cluster.fork();

    });

// Code to run if we're in a worker process
} else {
	logger.info('Zenith', 'Starting process on CPU ' + cluster.worker.id );
	startZenithESB();
}

/**
 * start an instance of the ESB
 */
function startZenithESB(){
	//@TODO currently hardcoded to accept HTTP connections
	//		change this to a generic form to add new transports
	
	var HttpTransport = require( TRANSPORT_PATH + 'http_transport');

	var config = serverConfig.httpServerConfig;

	var httpTransport = new HttpTransport(config, messageFormatter);
	httpTransport.start(); //start the listner
	
}
