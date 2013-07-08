/**
 * Entry point for the Zenith ESB
 */
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
logger.info('Zenith', 'Starting Zenith ESB .....');
var HttpTransport = require( TRANSPORT_PATH + 'http_transport');

var config = serverConfig.httpServerConfig;

var httpTransport = new HttpTransport(config, messageFormatter);
httpTransport.start(); //start the listner