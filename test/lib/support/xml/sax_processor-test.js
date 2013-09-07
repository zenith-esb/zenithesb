/**
 * test case for /lib/support/xml/sax_processor module
 */
var vows = require('vows'), assert = require('assert');
var saxProcessor = require('../../../../lib/support/xml/sax_processor');

var xmlInput = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">'
		+ '<soapenv:Header>'
		+ '<routing xmlns="http://someuri">xadmin;server1;community#1.0##</routing>'
		+ '</soapenv:Header>'
		+ '<soapenv:Body>'
		+ '<m:buyStocks xmlns:m="http://services.samples/xsd">'
		+ '<order>'
		+ '<symbol>IBM</symbol>'
		+ '<buyerID>Dushan</buyerID>'
		+ '<price>140.34</price>'
		+ '<volume>2000</volume>'
		+ '</order>'
		+ '</m:buyStocks>' + '</soapenv:Body>' + '</soapenv:Envelope>';

var xmlInput2 = '<?xml version=\'1.0\' encoding=\'UTF-8\'?>'
		+ '<soapenv:Envelope xmlns:wsa="http://www.w3.org/2005/08/addressing" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">'
		+ '<soapenv:Header>'
		+ '<wsa:To>http://localhost:9000/services/SimpleStockQuoteService</wsa:To>'
		+ '<wsa:MessageID>urn:uuid:D538B21E30B32BB8291177589283717</wsa:MessageID>'
		+ '<wsa:Action>urn:getQuote</wsa:Action>' + '</soapenv:Header>'
		+ '<soapenv:Body>' + '<m0:getQuote xmlns:m0="http://services.samples">'
		+ '<m0:request>' + '<m0:symbol>IBM</m0:symbol>' + '</m0:request> '
		+ '</m0:getQuote>' + '</soapenv:Body>' + '</soapenv:Envelope>';

saxProcessor.getElementValue(xmlInput, 'http://someuri', 'routing',
		function(err, out) {
			vows.describe('SAX processor').addBatch({
				'Routing Header Info' : {
					topic : out[0],

					'we get xadmin;server1;community#1.0##' : function(topic) {
						assert.equal(topic, 'xadmin;server1;community#1.0##');
					},

					'we get something Else' : function(topic) {

					}
				}
			}).run();

		});

saxProcessor.getElementValue(xmlInput2, 'http://www.w3.org/2005/08/addressing', 'To', function(err, out){
	vows.describe('SAX processor').addBatch({
		'Request URL' : {
			topic : out[0],

			'we get http://localhost:9000/services/SimpleStockQuoteService' : function(topic) {
				assert.equal(topic, 'http://localhost:9000/services/SimpleStockQuoteService');
			},

			'we get something Else' : function(topic) {

			}
		}
	}).run();
	 });

saxProcessor.getElementValue(xmlInput2, 'http://services.samples', 'symbol', function(err, out){
	vows.describe('SAX processor').addBatch({
		'Request Parameters' : {
			topic : out[0],

			'we get IBM' : function(topic) {
				assert.equal(topic, 'IBM');
			},

			'we get something Else' : function(topic) {

			}
		}
	}).run();
	 });
