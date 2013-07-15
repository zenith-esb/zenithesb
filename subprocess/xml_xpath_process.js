var xmldom = require('xmldom').DOMParser;
var xpath = require('xpath');
var logger = require('../lib/logger');
var msgq = [];

/**
 * 
 * this is a sub process of Zenith server. Currently it accepts a message in
 * following format
 * { xml: "xmlString", xpath:"xpathString ", regEx:"IBM", caseSense:false} 
 * And evaluates the regular expression on the element located by xpath
 * if it matches the expression returns object contains the result
 */

process.on('message', function(m) {	
	        //
		var resp = {
			result : null,
			hasRegEx : false
		};
	    msgq.push(m);
	    var servMsg = msgq.shift();
		try{
			var doc = new xmldom().parseFromString(servMsg.xml);
			var results = xpath.select(servMsg.xpath, doc);
			var result = results[0];
			
			if(result == null){
				//no value for the expath expression
				logger.debug('XMLXPathProcess', 'XML message does not contain result for' 
						+ 'XPath exp : ' + servMsg.xpath);
				process.send(resp);
			}
			
			var regExp;
			
			if(servMsg.checkRegEx) {
				//code to check xml against regExp
				if(caseSensitive = false){
					regExp = new RegExp(servMsg.regEx,'i');
				}
				else{
					regExp = new RegExp(servMsg.regEx);
				}
				
				resp.hasRegEx =  regExp.test(result);
				logger.debug('XMLXPathProcess', 'RegExp evaluation result :' + resp.hasRegEx);
				process.send(resp.hasRegEx);
			} else {
				//code to get the element value
				
				resp.result = result.firstChild.data;
				logger.debug('XMLXPathProcess', 'Element value : ' +resp.result);
				process.send(resp.result);
			}
			
			
		}catch(err){
			process.send({ result: err });
		}

});
