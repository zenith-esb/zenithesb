/**
 * New node file
 */

var url = require('url');
var http = require("http");
var logger = require('../logger');


function callService(body, option, callback) {
   
	//web service endpointurl
    var parseURL = url.parse(option.url);	
    var options = {
	                host: parseURL.hostname,
	                port: parseURL.port,
	                path: parseURL.path,
	                method: option.method,
					headers:{
					         'content-type':option.headers['content-type'],
					         'soapaction':option.headers['soapaction'],
					         'transfer-encoding':option.headers['transfer-encoding']
					         }
                }
    //create the http request with the soap message
	var post_req = http.request(options, function(res) {
	   					res.setEncoding('utf8');
	   					res.on('data', function (chunk) {
	       				//	console.log('Response: ' + chunk);
	       				logger.debug('EndPoint', 'Response: ' + chunk);	
	       					callback(null, chunk);
	   					}); 
  	              }); 
    
    //error condition
    post_req.on('error', function(e) {
    	  //console.log('problem with request: ' + e.message);
    	logger.error('EndPoint', 'problem with request: ' + e.message);
    	  callback(e);   
    	 });

    // post the data
	post_req.write(body);
	post_req.end();
}

exports.callService = callService;