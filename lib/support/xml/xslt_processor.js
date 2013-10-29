/**
 * Transform a given XML file into another XML file using a given XSLT transformation file
 */

xslt = require('node_xslt');

/**
 * srcXML - xml string to be transformed
 * xsltFile - filename containing the XSLT String
 * parameters - PI parameters passed as a array ['parameterName','parameterValue',...]
 */
exports.transformXML = function(srcXML, xsltFile, parameters){
	
	var sourceXML= xslt.readXmlString(srcXML);
	var xsltString = xslt.readXsltFile(xsltFile);
	var transformedXML = xslt.transform(xsltString, sourceXML, parameters);
	
	return transformedXML;
	
};

