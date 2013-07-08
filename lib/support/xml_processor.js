var xmldom = require('xmldom').DOMParser;
var xpath = require('xpath');
var msgq = [];

/*
 * 
 * this is a sub process of Zenith server. Currently it accepts a message in
 *following format
 *{ xml: "xmlString", xpath:"xpathString ", regEx:"IBM", caseSense:false} 
 *And evaluates the regular expression on the element located by xpath
 *if it matches the expression returns object contains the result
 */

process.on('message', function(m) {	
	        
	    msgq.push(m);
	    var servMsg = msgq.shift();
		try{
			var doc = new xmldom().parseFromString(servMsg.xml);
			var results = xpath.select(servMsg.xpath,doc);
			var result = results[0];
			var regExp;
			if(caseSensitive = false){
				regExp = new RegExp(servMsg.regEx,'i');
			}
			else{
				regExp = new RegExp(servMsg.regEx);
			}
			process.send({ result:  regExp.test(result) });
		}catch(err){
			process.send({ result: err });
		}

});
