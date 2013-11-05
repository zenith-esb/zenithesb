/**
 * this is the configuration file. message object has the message body in
 * message.body field. 
 * callback function should be called with the result. this result is sent
 * back to the request
 */

var SAMPLE_NO = '5';
var logger = require('../lib/logger');
var samples = require('../samples/sample_' + SAMPLE_NO);
//var loadtest =  require('../samples/loadtest/loadtest');;

function mediate(message, callback){	

	//run the pre defined sample. see ./samples dir
	samples.executeSample(message, callback);

	//run the load testing scenario
	//loadtest.executeTest(message, callback);
	
	
}
exports.mediate = mediate;
