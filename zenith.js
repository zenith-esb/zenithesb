/**
 * Entry point for the Zenith ESB
 */
var cluster = require('cluster');
var logger = require('./lib/logger');
var MessageFormatter = require('./lib/message_formatter');
var transportFactory = require('./lib/transport/transport_factory');
var messagingFactory = require('./lib/amqp/messaging_factory');
var messageFormatter = new MessageFormatter();
var serverConfig = require('./configuration/server_config');
var TRANSPORT_PATH = './lib/transport/';
var app = require('./lib/monitor/app.js')
var msgServerStarted = false;


//Code to run if we're in the master process
if (cluster.isMaster) {
  // Count the machine's CPUs
	logger.info('Zenith', ' Starting Zenith ESB .....');
    var cpuCount = require('os').cpus().length;

	//starting messaging server
	if(!msgServerStarted){
		messagingFactory.initialize();
		msgServerStarted = true;
	}
	
    logger.info('Zenith', ' Starting process(es) on ' + cpuCount +
    		' core(s)');
    		
    // Create a worker for each CPU
    for (var i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }

    // Listen for dying workers
    cluster.on('exit', function (worker) {

        // Replace the dead worker,
    	logger.info('Zenith', ' Worker ' + worker.id + ' died');
    	cluster.fork();

    });

// Code to run if we're in a worker process
} else {
	logger.info('Zenith', ' Starting process on CPU ' + cluster.worker.id );
	startZenithESB();
}

/**
 * start an instance of the ESB
 */
function startZenithESB(){
	
	var transports = transportFactory.getTransport(messageFormatter);
	//starting transports
	for(x in transports){
		var server = transports[x].start();
		app.monitor.Monitor(server,{'collect_all': 'yes', 'top':{'view':3,'limit':100, 'timelimit':1, 'sortby': 'max_time'}});//add server to monitor
	}
	
	
	app.startDashBoard();
	
}
