/**
 * New node file
 */
var vows = require('vows'), assert = require('assert');
var serverConfig = require('../configuration/server_config');

// test suit for each module
vows.describe('Zenith entry point').addBatch({
	'Http Server configuration' : {
		topic : function() {
			return serverConfig.transports[0].config.port;
		},

		'The port is 8280' : function(topic) {
			assert.equal(topic,'8280');
		}
	}
}).run();

//HTTPS configuration
vows.describe('Zenith entry point').addBatch({
	'Https configuration' : {
		topic : function() {
			return serverConfig.transports[1].config.port;
		},

		'The port is 8243' : function(topic) {
			assert.equal(topic,'8243');
		}
	}
}).run();

//Monitor configuration
vows.describe('Zenith entry point').addBatch({
	'Monitor configuration' : {
		topic : function() {
			return serverConfig.monitor.port;
		},

		'The port is 3000' : function(topic) {
			assert.equal(topic,'3000');
		}
	}
}).run();

