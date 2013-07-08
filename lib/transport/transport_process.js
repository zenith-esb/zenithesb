/**
 *module to do any processing on transport headers
 */
var http = require('http');
var url = require('url');
var logger = require('../logger');
var MessageFormatter = require('../message_formatter');
var ServiceViewer = require('./service_viewer');
var pjson = require('../../package.json');

module.exports = {

	viewServices : function(req, resp) {

		logger.debug("Transport_process", "start of viewService method");

		ServiceViewer.view(req, resp);

		logger.debug("Transport_process", "End of viewService method");

	},

	/**
	 *pass service request to message formatter
	 */
	formatMessage : function(req, resp, messageFormatter) {

		var parsedURL = url.parse(req.url, true);
		if (parsedURL.search === '') {
			messageFormatter.process(req, resp, function(err, final_resp){				
				resp.end();
				
			});
		}
	}
};