/**
 * this is the configuration file. message object has the message body in
 * message.body field. 
 * callback function should be called with the result. this result is sent
 * back to the request
 */

var logger = require('../lib/logger');
var samples = require('../samples/sample_1');
var loadtest = require('../samples/loadtest/direct_proxy');

function mediate(message, callback){	

	//run the pre defined sample. see ./sample
	samples.executeSample(message, callback);
	
	//loadtest.executeTest(message, callback);
	
	
}
exports.mediate = mediate;
