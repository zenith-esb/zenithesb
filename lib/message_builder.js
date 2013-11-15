/**
 *module to create message 
 */
var url = require('url');
var logger = require('./logger');
var zenithMessage = require('./zenith_message');
var pjson = require('../package.json');

exports.buildMessage = buildMessage;
exports.buildResponse = buildResponse;

/**
 * build the message from the request
 * @param req request obj from the client
 * @param callback 
 */
function buildMessage(req, callback){
	
	//things in the request object
	var parsedURL = url.parse(req.url, true);	
	//every thing should be passed to the option from the request
    var transportHeaders = {
    		
    		method: req.method,    
    		headers: req.headers,
    		url : parsedURL        		
    		
    };
    
    //set the headers from the transport to the message object
    zenithMessage.transportHeaders = transportHeaders;
    //set the content type
    if(req.headers['content-type'] != null){
    	 var contentType = req.headers['content-type'].split(';');
    	  //@TODO check whether charset value is needed
    	    zenithMessage.contentType = contentType[0];
    }
   
    
	//extract the body of the message
	var body = '';      /////////////////////might not work for every type
    req.on('data', function (chunk) {
    	//set the message body with the request's body
    	body = body + chunk;
    	
    });   
    
    req.on('end', function(){
    	logger.debug('MessageBuilder', 'Request : ' + body + '');
    	zenithMessage.body = body;
    	
    	process(zenithMessage, function(result){
    		callback(result);
    	});    	
    });
    
    req.on('error', function(err){
    	callback(err, null);
    });
    
	
	
	return zenithMessage;
}

/**
 * build response to send to the requester 
 * @param ZenithMessage
 * @param request
 * @param response
 * @param callback
 */
function buildResponse(zenithMessage, request, response, callback){
	//check the content type of the Zenith message and request
	/*
	var reqContentType = request.headers['content-type'].split(';');
	
	if(zenithMessage.contentType === reqContentType[0]) {
	logger.debug('MessageBuilder','similar content type : ' +
			request.headers['content-type']);
	
	//response.writeHead(proxy_response.statusCode, proxy_response.headers);
	response.writeHead(200+' OK', {'content-type':request.headers['content-type'], 
		'server': pjson.name+'/'+pjson.version});
	response.write(zenithMessage.body);
	callback(null, response);
		
	} else {
	logger.debug('MessageBuilder','different content type. req : ' 
			+ reqContentType[0] + ' message : '
			+ zenithMessage.contentType);	
		//convert the content type to suit the request
		//temperary 
		response.write(zenithMessage.body);
		callback(null, response);
	}
	*/
	//////////////////TODO///////////////////////////
	//
	//	  handle the situation where err is passed.
	//	  build a default error message using request's 
	//	  data (content type, etc) and build response
	// 	
	////////////////////////////////////////////////
	var requestContentType = request.headers['content-type'];
	var responseAcceptType = request.headers['accept'];
	var responseContentType = zenithMessage.contentType;
	logger.debug('MessageBuilder', 'Respose status: ' + 
			zenithMessage.transportHeaders.statusCode + ' content-type: ' +
			responseContentType);
	
	zenithMessage.transportHeaders.headers['server'] = pjson.name+'/'+pjson.version; 
	
	response.writeHead(zenithMessage.transportHeaders.statusCode, 
				zenithMessage.transportHeaders.headers);
	response.write(zenithMessage.body);
	callback(null, response);
	
	
	
	
}
/**
 * method to do any additional processing after receiving 
 * full message body
 * @param message
 * @param callback
 */
function process(message, callback){
	
	//no modification at the moment
	callback(message);	
}

/**
 * method to build default error response
 * @param zenithMessage
 * @param request
 * @param response
 * @param callback
 */
function buildDefaultErrorResponse(zenithMessage, request, response, callback){
	response.writeHead(500, {'Content-Type': request.headers['content-type'],
	'Server': pjson.name+'/'+pjson.version
	});
	callback(null, response);

	};
