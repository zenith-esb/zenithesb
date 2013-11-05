/**
 * Module to extract values from an element using SAX based processing
 */
var sax = require("sax");
var logger = require('../../logger');

/**
 * returns the values as an array which match the element and the namespace
 * 
 * @param xmlString
 *            xml as a string
 * @param namespaceURI
 *            namespace uri for the element
 * @param element
 *            element name of the tag
 * @param callback
 */
exports.getElementValue = function(xmlString, namespaceURI, element, callback) {

	var option = {
		xmlns : true
	};

	var strict = true; // set to false for html-mode
	var parser = sax.parser(strict, option);

	// var hasElem = false;
	var elemValues = [];
	var foundElement = false;

	parser.onerror = function(e) {
		// an error happened.
		// clear the error
		logger.error('SAXProcessor', 'error: ' + e.message);
		this._parser.error = null;
		this._parser.resume();
	};
	parser.ontext = function(t) {
		// got some text. t is the string of text.
		if (foundElement) {
			logger.debug('SAXProcessor', 'Element value: ' + t);
			// callback(null, t);
			elemValues.push(t);
			foundElement = false;
		}
	};
	parser.onopentag = function(node) {
		// opened a tag. local variable has the element name
		// and uri variable has the namespace
		if (node.local === element && node.uri === namespaceURI) {
			foundElement = true;
			hasElem = true;
		}

	};
	parser.onattribute = function(attr) {
		// an attribute. attr has "name" and "value"
	};
	parser.onend = function() {
		// parser stream is done, and ready to have more stuff written to it.
		callback(null, elemValues);
	};
	parser.write(xmlString).close();
};

/**
 * 
 * @param xmlString xmlMessage before transformation
 * @paran transformedXML transformed xml body
 * @param callback callback function to get the transfomed SOAP
 * 
 */
exports.getTransformedSOAP = function(xmlString, transformedXML, callback) {

	var option = {
		xmlns : true
	};

	var strict = true; // set to false for html-mode
	var parser = sax.parser(strict, option);

	// var hasElem = false;
	var element = 'Envelope';
	var foundElement = false;
	var xmlBlock = '';
	var attributeSet = '';
	var currentNodeWithNs = '';
	var attrCount = 0;
	var finishedAttrSearching = false;
	var transformedSOAP = '';

	parser.onerror = function(e) {
		// an error happened.
		// clear the error
		logger.error('SAXProcessor', 'error: ' + e.message);
		this._parser.error = null;
		this._parser.resume();
	};
	parser.ontext = function(t) {

		if (t) {
			xmlBlock += t;
		}
	};
	parser.onopentag = function(node) {
		// opened a tag. local variable has the element name
		// and uri variable has the namespace

		if (node.local == element) {
			foundElement = true;
		}

		if (foundElement) {

			if (node.prefix) {
				currentNodeWithNs = node.prefix + ':' + node.local;
			} else {
				currentNodeWithNs = node.local;
			}

			xmlBlock += '<' + currentNodeWithNs + attributeSet + '>';

			currentNodeWithNs = '';

		}

		if (finishedAttrSearching) {
			attributeSet = '';
		}
	};
	parser.onattribute = function(attr) {

		attrCount += 1;
		attributeSet += ' ' + attr.name + '="' + attr.value + '"';

		if (attrCount == this.attribList.length) {
			attrCount = 0;
			finishedAttrSearching = true;
		}

	};

	parser.onclosetag = function(t) {
		// parser stream is done, and ready to have more stuff written to it.
		if (foundElement) {
			xmlBlock += '</' + t + '>';
		}

		if (t == 'soapenv:Header') {
			foundElement = false;
			transformedSOAP = '<?xml version=\'1.0\' encoding=\'UTF-8\'?>'+
			xmlBlock + '<soapenv:Body>' + transformedXML.trim().trim()
					+ '</soapenv:Body></soapenv:Envelope>';
			
			callback(null, transformedSOAP);

		}

	};

	parser.onclosenamespace = function(ns) {
		// parser stream is done, and ready to have more stuff written to it.

	};

	parser.onopennamespace = function(ns) {
		// parser stream is done, and ready to have more stuff written to it.

	};

	parser.onend = function() {

	};

	parser.write(xmlString);
};
