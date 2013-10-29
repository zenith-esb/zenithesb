/**
 * XSLT transformation scenario
 */

var SUPPORT_LIBS = '../lib/support/';
var XSLT_RES = './resources/xslt/';
var logger = require('../lib/logger');

var soapErrorMsg = require('../lib/util/errormsg/soap_err_msg');

exports.executeSample = function(zenithMessage, callback) {
	var reqUrl = zenithMessage.transportHeaders.url; // returns url object

	if (reqUrl.pathname === '/services/StockQuoteProxy') {

		var serviceURL = 'http://localhost:9000/services/SimpleStockQuoteService';
		logger.debug('SampleConfig', 'EPR: ' + serviceURL);

		var option = {
			url : serviceURL
		};

		var endpoint = require(SUPPORT_LIBS + 'ws_endpoint');
		var xslt = require(SUPPORT_LIBS + 'xml/xslt_processor');

		var xsltFile = XSLT_RES + 'transform.xslt';
		var xsltFile_back = XSLT_RES + 'transform_back.xslt';
		console.log('hghghghghgh'+zenithMessage.body);
		var transformedMsg = xslt
				.transformXML(zenithMessage.body, xsltFile, []);

		zenithMessage.body = transformedMsg;

		endpoint.callService(zenithMessage, option, function(err, message) {

			var transformedBckMsg = xslt.transformXML(message, xsltFile_back, []);

			callback(null, transformedBckMsg);
			// callback(null, message);

		});

	} else {
		var errMsg = 'Invalid EPR value.';
		zenithMessage.body = soapErrorMsg.getSOAP11Fault(errMsg);
		callback(null, zenithMessage);

	}

};