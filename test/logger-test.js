/**
 * test case for /lib/support/logger module
 */
var vows = require('vows'), assert = require('assert');
var logger = require('../../../../lib/support/logger');

var logMessage1 = '[2013-11-18 10:37:14.588] [INFO] [Zenith] -  Starting Zenith ESB ..... ';
var logMessage2 = '[2013-11-18 10:38:45.425] [DEBUG] [ServiceView] - Start of View method';
var logMessage3 = '[2013-11-18 10:39:56.392] [ERROR] [WSEndPoint] - problem with request: connect ECONNREFUSED';

vows.decribe ('Zenith log message type').addBatch({
	'Logger' : {
		topic:function(){
			return logger.trace;
		},
		'we get INFO': function(topic){
			assert.equal(topic,'INFO');
		}
	}
}
		).run();