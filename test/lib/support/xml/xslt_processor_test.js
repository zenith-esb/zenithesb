
var SUPPORT_LIBS = '../../../../lib/support/';
var XSLT_RES = '../../../../resources/xslt/';
var vows = require('vows'), assert = require('assert');

var xmlInput = '<?xml version=/'1.0/' encoding=/'UTF-8/'?>' 
+ '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">'
+ '<soapenv:Header xmlns:wsa="http://www.w3.org/2005/08/addressing">'
+ '<wsa:MessageID>urn:uuid:944e63e8-1949-4378-b3f3-952224de843c</wsa:MessageID>'
+ '<wsa:Action>urn:getQuote</wsa:Action></soapenv:Header><soapenv:Body>'
+ '<m0:CheckPriceRequest xmlns:m0="http://services.samples"><m0:Code>IBM</m0:Code>'
+ '</m0:CheckPriceRequest></soapenv:Body>'
+ '</soapenv:Envelope>';

var expectedRequest = '<?xml version=/'1.0/' encoding=/'UTF-8/'?><soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"><soapenv:Header xmlns:wsa="http://www.w3.org/2005/08/addressing"><wsa:MessageID>urn:uuid:82bfdbe3-d103-46b7-bf4a-a8261726f732</wsa:MessageID>'
+ '<wsa:Action>urn:getQuote</wsa:Action>'
+ '</soapenv:Header>'
+ '<soapenv:Body><m:getQuote xmlns:m="http://services.samples">'
+ '<m:request>'
+ '<m:symbol>IBM</m:symbol>'
+ '</m:request>'
+ '</m:getQuote></soapenv:Body></soapenv:Envelope>';

	var xslt = require(SUPPORT_LIBS + 'xml/xslt_processor');
	var saxProcessor = require(SUPPORT_LIBS + 'xml/sax_processor');
		
	var xsltFile = XSLT_RES + 'transform.xslt';
	var xsltFile_back = XSLT_RES + 'transform_back.xslt';
		
	//transform soap body to something that the real service can understand
	var transformedMsg = xslt
				.transformXML(xmlInput, xsltFile, []);
	
	var transformedBckMsg = xslt
	.transformXML(expectedRequest, xsltFile_back, []);

		// create the soap message using original soap headers and transformed soap body
		saxProcessor.getTransformedSOAP(xmlInput, transformedMsg, function(err, transformedSOAP){
			
			vows.describe('XSLT Traformation Module').addBatch({
				'Request Transformation' : {
					topic : function() {
						return transformedSOAP;
					},

					'we get expected Request' : function(topic) {
						assert.equal(topic,expectedRequest);
					},
					
					'we dont get expected Request' : function(topic) {
						assert.notEqual(topic,expectedRequest);
					}
				}
			}).run();
			
});

// create the soap message using original soap headers and transformed soap body
saxProcessor.getTransformedSOAP(expectedRequest, transformedBckMsg, function(err, transformedBckSOAP){
	
	vows.describe('XSLT Traformation Module').addBatch({
		'Request Transformation To Original' : {
			topic : function() {
				return transformedBckSOAP;
			},

			'we get original Request' : function(topic) {
				assert.equal(topic,xmlInput);
			},
			
			'we dont get original Request' : function(topic) {
				assert.notEqual(topic,xmlInput);
			}
		}
	}).run();
	
});