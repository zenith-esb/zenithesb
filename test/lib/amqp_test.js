var serverConfig = require('../../configuration/server_config');

vows.describe('Messaging queue Configuration').addBatch({
	'amqp status' : {
		topic : function() {
			return serverConfig.amqp.status;
		},

		'amqp is running' : function(topic) {
			assert.equal(topic,'true');
		}
	},
	
	'amqp server configuration' : {
		topic : function() {
			return serverConfig.amqp.server.port;
		},

		'amqp is running on port 5672' : function(topic) {
			assert.equal(topic,'5672');
		}
	}
});