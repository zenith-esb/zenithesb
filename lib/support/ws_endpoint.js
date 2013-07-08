/**
 * This module can be used to communicate using HTTP/SOAP
 * to connect to a specific endpoint pass the url to the 
 * option variable. otherwise destination will be taken 
 * from the message object. 
 * 
 */
var http = require('http');
var url = require('url');
var logger = require('../logger');

module.exports = {
		/**
		 * method to call web service using SOAP. connect to the web 
		 * service and pass the SOAP message
		 * @param message zenith message object 
		 * @param option details related to the web service
		 * @param callback
		 */
		callService : function (message, option, callback){
			
		    var parseURL = url.parse(option.url);	
			var wsOptions={
					hostname : parseURL.hostname,
					path : parseURL.path,
					port : parseURL.port,
					method : message.transportHeaders.method,
					agent: false
				};
			var body = '';
			var wsRequest = http.request(wsOptions, function(wsResponse) {
					wsResponse.on('data', function(chunk) {
						//ws reply body
						body = body + chunk;
							
					});
					wsResponse.on('end', function() {
						
						//when every thing is done send the message
						//object back
						logger.debug('WSEndPoint', 'Response: ' + body);
						message.body = body;

						message.transportHeaders.statusCode = wsResponse.statusCode;
						message.transportHeaders.headers = wsResponse.headers;
						//check this ////////
						message.contentType = 'text/xml';//wsResponse.headers['content-type']
						callback(null, message);
					});
					
				});
				
				wsRequest.on('error', function(er){
				
					logger.error('WSEndPoint', 'problem with request: ' + er.message);	
					//generate a SOAP message with the error and pass it
					//callback(er, message);
				});
				
				wsRequest.write(message.body);
				wsRequest.end();	
			
		}
}
