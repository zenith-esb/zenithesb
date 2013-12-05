var SUPPORT_LIBS = '../../../../lib/support/';
var XSLT_RES = '../../../../resources/xslt/';
var vows = require('vows'), assert = require('assert');

var request = '<?xml version=/'1.0/' encoding=/'UTF-8/'?><soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"><soapenv:Header xmlns:wsa="http://www.w3.org/2005/08/addressing"><wsa:MessageID>urn:uuid:82bfdbe3-d103-46b7-bf4a-a8261726f732</wsa:MessageID>'
+ '<wsa:Action>urn:getQuote</wsa:Action>'
+ '</soapenv:Header>'
+ '<soapenv:Body><m:getQuote xmlns:m="http://services.samples">'
+ '<request>'
+ '<symbol>IBM</symbol>'
+ '</request>'
+ '</m:getQuote></soapenv:Body></soapenv:Envelope>';

cbrRoute.CBRSOAPBodyRoute(request, '//request/symbol','IBM', function(){

	vows.describe('CBR Body Routing Module').addBatch({
		'Body Value check' : {
			topic : function() {
				return 'IBM';
			},

			'we get IBM' : function(topic) {
				assert.equal(topic,'IBM');
			},
			
			'we dont get IBM' : function(topic) {
				assert.notEqual(topic,'IBM');
			}
		}
	}).run();
	
});