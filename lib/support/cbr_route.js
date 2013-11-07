/**
 * module has the functions for content based routing
 */

var xpath = require('xpath')
      , dom = require('xmldom').DOMParser;

exports.CBRSOAPBodyRoute = function(soapMsg, xpath, content, callback){
	
    var doc = new dom().parseFromString(soapMsg)    ;
    var nodes = xpath.select(xpath, doc);
    
    if(nodes[0].firstChild.data == content){
    	
    	callback();
    }
    
    else{
    	
    }
};