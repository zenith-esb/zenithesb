
var xmldom = require('xmldom').DOMParser;
var xpath = require('xpath');

/*check whether elemnt given by xpath contains the regular expression
 * xmlString(string) - XML as a string
 * xpathString(string) - xpath of the element
 * regEx(String) - regular expression
 * caseSensitive(boolean) - consider the case when strings are compared
 * throws error
 */

exports.isElementInXml = function(xmlString,xpathString,regEx,caseSensitive){
	try{
		var doc = new xmldom().parseFromString(xmlString);
		var results = xpath.select(xpathString,doc);
		var result = results[0];
		var regExp;
		if(caseSensitive = false){
			regExp = new RegExp(regEx,'i');
		}
		else{
			regExp = new RegExp(regEx);
		}
		return regExp.test(result);
	}catch(err){
		return new Error(err);
	}
}
