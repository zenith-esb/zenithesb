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

		'we get 8280' : function(topic) {
			assert.equal(topic,'8280');
		}
	}
}).run();