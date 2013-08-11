/**
 * test case for /lib/support/xml/sax_processor module
 */
var vows = require('vows'), assert = require('assert');
var saxProcessor = require('../../../../lib/support/xml/sax_processor');

var xmlInput =
	'<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">'+
	'<soapenv:Header>'+
		'<routing xmlns="http://someuri">xadmin;server1;community#1.0##</routing>'+
	'</soapenv:Header>'+
	'<soapenv:Body>'+
		'<m:buyStocks xmlns:m="http://services.samples/xsd">'+
			'<order>'+
				'<symbol>IBM</symbol>'+
				'<buyerID>Dushan</buyerID>'+
				'<price>140.34</price>'+
				'<volume>2000</volume>'+
			'</order>'+
		'</m:buyStocks>'+
	'</soapenv:Body>'+
	'</soapenv:Envelope>';

var xmlInput2 = 
	'<?xml version=\'1.0\' encoding=\'UTF-8\'?>'+
	'<soapenv:Envelope xmlns:wsa="http://www.w3.org/2005/08/addressing" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">'+
		'<soapenv:Header>'+ 
			'<wsa:To>http://localhost:9000/services/SimpleStockQuoteService</wsa:To>'+ 
			'<wsa:MessageID>urn:uuid:D538B21E30B32BB8291177589283717</wsa:MessageID>'+ 
			'<wsa:Action>urn:getQuote</wsa:Action>'+ 
		'</soapenv:Header>'+ 
		'<soapenv:Body>'+ 
			'<m0:getQuote xmlns:m0="http://services.samples">'+
				'<m0:request>'+
					'<m0:symbol>IBM</m0:symbol>'+ 
				'</m0:request> '+
			'</m0:getQuote>'+ 
		'</soapenv:Body>'+
	'</soapenv:Envelope>';

saxProcessor.getElementValue(xmlInput, 'http://someuri', 'routing', function(err, out){
	console.log(out[0]);
	//assert.equal(out[0], 'xadmin;server1;community#1.0##');
});
saxProcessor.getElementValue(xmlInput2, 'http://www.w3.org/2005/08/addressing', 'To', function(err, out){
	console.log(out[0]);
	//assert.equal(out[0], 'http://localhost:9000/services/SimpleStockQuoteService');
});

saxProcessor.getElementValue(xmlInput2, 'http://services.samples', 'symbol', function(err, out){
	console.log(out[0]);
	//assert.equal(out[0], 'IBM');
});
