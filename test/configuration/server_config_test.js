// test cases for server configurations

var serverConfig = require('../../configuration/server_config');

vows.describe('Zenith Server Configuration').addBatch({
	'Http Server configuration' : {
		topic : function() {
			return serverConfig.transports[0].config.port;
		},

		'we get 8280' : function(topic) {
			assert.equal(topic,'8280');
		}
	},
	
	'Https Server configuration' : {
		topic : function() {
			return serverConfig.transports[1].config.port;
		},

		'we get 8243' : function(topic) {
			assert.equal(topic,'8243');
		}
	},
	
	'Https Server configuration' : {
		topic : function() {
			return serverConfig.transports[1].config.cert;
		},

		'we get resources/security/zenith-cert.pem' : function(topic) {
			assert.equal(topic,'resources/security/zenith-cert.pem');
		}
	},
	
	'Https Server configuration' : {
		topic : function() {
			return serverConfig.transports[1].config.key;
		},

		'we get resources/security/zenith-key.pem' : function(topic) {
			assert.equal(topic,'resources/security/zenith-key.pem');
		}
	},
	
	'Monitor configuration' : {
		topic : function() {
			return serverConfig.monitor.port;
		},

		'we get 3000' : function(topic) {
			assert.equal(topic,'3000');
		}
	}
	
}).run();