/**
 * Transform a given XML file into another XML file using a given XSLT transformation file
 */

xslt = require('node_xslt');

/**
 * srcXML - xml string to be transformed
 * xsltFile - filename containing the XSLT String
 * parameters - PI parameters passed as a array ['parameterName','parameterValue',...]
 */
exports.transformMsg = function(srcXML, xsltFile, parameters){
	
	sourceXML= xslt.readXmlString(srcXML);
	xsltString = xslt.readXsltFile(xsltFile);
	transformedXML = xslt.transform(xsltString, sourceXML, parameters);
	
	return transformedXML;
	
};

