/**
 * 
 * this is a sub process of Zenith server. Currently it accepts a message in
 * following format
 * { xml: string, xpath:string, nameSpace:{},regEx:string , checkRegEx:boolean,caseSense:boolean} 
 * Ex.{ xml:"anyxmlstring", xpath:"//m0:request[1]/m0:symbol", nameSpace:{'m0':'http://services.samples'},checkRegEx:true, regEx:"IBM",caseSense:false}
 * And evaluates the regular expression on the element located by xpath
 * if it matches the expression returns object contains the result
 */

var libxmljs = require("libxmljs");
var msgq = [];


process.on('message', function(m) {	
	        //
		var resp = {
			result : null,
			hasRegEx : false
		};
	    msgq.push(m);
	    var servMsg = msgq.shift();
		try{
			var doc = libxmljs.parseXml(servMsg.xml);
			var result;
			if(servMsg.nameSpace!=null){
				result = doc.get(servMsg.xpath,servMsg.nameSpace);
			}else{
				result = doc.get(servMsg.xpath);
			}
			var result = doc.get(servMsg.xpath,servMsg.nameSpace);
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
				resp.hasRegEx =  regExp.test(result.text());
				logger.debug('XMLXPathProcess', 'RegExp evaluation result :' + resp.hasRegEx);
				process.send(resp);
			} else {
				//code to get the element value
				
				resp.result = result.text();
				logger.debug('XMLXPathProcess', 'Element value : ' +resp.result);
				process.send(resp);
			}
			
			
		}catch(err){
			process.send({ result: err });
		}

});
