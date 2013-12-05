/**
 * module to handle service and WSDL requests
 */
var http = require('http');
var fs = require('fs');
var SERV_CONF_PTH = '../../configuration/service_config.json';
var SERV_WSDL_PTH = './resources/wsdl/';
var url = require('url');
var logger = require('../logger');
var serviceConfig = require(SERV_CONF_PTH);

module.exports = {

	view : function(req, resp) {
		
		logger.debug('ServiceView','Start of View method');
		
		var parsedURL = url.parse(req.url);
		
		logger.debug('ServiceView', 'pathname is '+parsedURL.pathname);
		logger.debug('ServiceView', 'Query is '+parsedURL.query);
		
		if (parsedURL.pathname === '/services' || //checks whether the request url is for wsdl or service view
				parsedURL.pathname === '/services/') {
			resp.writeHead(200, {
				"Content-Type" : "text/html"
			});
			resp.write(createHTML(serviceConfig));
			resp.end();

		} else if (parsedURL.query === 'wsdl') { //if the request is for wsdl 
			
			var splitURL = parsedURL.pathname.split('/');
			var serviceName = splitURL[splitURL.length - 1];
			var wsdl = '';
			logger.debug('ServiceView','serviceName is '+serviceName);
			
			//for each services mentioned in the service_config.json
			for (i in serviceConfig.services) {
				if (serviceConfig.services[i].serviceName === serviceName) {
					wsdl = SERV_WSDL_PTH + serviceConfig.services[i].wsdl;
					break;
				}
			}
			
			
			fs.readFile(wsdl, function(err, buffer) {
				logger.debug('ServiceView', 'wsdl file is '+wsdl);
				if (!err) {
					resp.writeHead(200, {
						"Content-Type" : "text/xml"
					});
					resp.write(buffer);
					resp.end();
				} else {
					resp.writeHead(200, {
						"Content-Type" : "text/plain"
					});
					resp.write('404 Not Found');
					resp.end();
				}
			});
		}
	}
};
//shows the services in the web browser as a HTML page
function createHTML(data){
	
	var html= '<html><head><title>Services</title></head>'+
				'<body><h2>Deployed services</h2>';
	
	for(i in data.services){
		
		html = html + '<h3><a href="/services/'+
				data.services[i].serviceName+'?wsdl">'+
				data.services[i].serviceName+'</a></h3>';
	}
	html = html + '</body></html>';
	return html;
}

/**
 * function to handle the changes in the service config 
 * file. user can add new service without restarting
 * the system
 */
function configChangeListner(){
	fs.watch(SERV_CONF_PTH, function (event, filename) {
		 console.log('event is: ' + event);
		 //not working
		delete require.cache[SERV_CONF_PTH];		
		serviceConfig = require(SERV_CONF_PTH);
		
		});
	
}