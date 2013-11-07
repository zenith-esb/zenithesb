/**
 * module has the functions for content based routing
 */

var xpathParser = require('xpath')
      , dom = require('xmldom').DOMParser;
var logger = require('../logger'); 

/**
 * soapMsg : message to be searched for the content
 * xpath : xpath expression for searching the content Note: Namespaces not supported
 * content : string being searched
 * callback : callback to be called when content match found
 */
exports.CBRSOAPBodyRoute = function(soapMsg, xpath, content, callback){
	
    var doc = new dom().parseFromString(soapMsg)    ;
    var nodes = xpathParser.select(xpath, doc);
    
    if(nodes[0].firstChild.data == content){
    	logger.debug('CBR_Route', 'matching content: "'+content+'" found');
    	callback();
    }
    
    else{
    	
    }
};