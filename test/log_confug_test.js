/**
 * New node file
 */
var vows = require('vows');
var assert = require('assert');

var eventConfig = require('../configuration/log_config');

// test suit for each module
vows.describe('Event config testing test').addBatch({
	'Http Server configuration' : {
		topic : function() {
			//return serverConfig.httpServerConfig.port;
			
		},

		'we get 8280' : function(topic) {
			assert.equal(topic,'8280');
		}
	}
}).run();