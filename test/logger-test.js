/**
 * test case for /lib/support/logger module
 */
var vows = require('vows'), assert = require('assert');
var logger = require('../configuration/log_config');

var logMessage1 = '[2013-11-18 10:37:14.588] [INFO] [Zenith] -  Starting Zenith ESB ..... ';
var logMessage2 = '[2013-11-18 10:38:45.425] [DEBUG] [ServiceView] - Start of View method';
var logMessage3 = '[2013-11-18 10:39:56.392] [ERROR] [WSEndPoint] - problem with request: connect ECONNREFUSED';

vows.describe('Zenith message type').addBatch({
	'Logger configuration' : {
		topic : function() {
			return logger.logLevel;
		},

		'we get DEBUG' : function(topic) {
			assert.equal(topic,'DEBUG');
		}
	}
}).run();

