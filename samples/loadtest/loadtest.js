/**
 * New node file
 */
var SUPPORT_LIBS = '../../lib/support/';
var soapErrorMsg = require('../../lib/util/errormsg/soap_err_msg');
var logger = require('../../lib/logger'); 

exports.executeTest = function(zenithMessage, callback){
	var reqUrl = zenithMessage.transportHeaders.url; //returns url object

	if(reqUrl.pathname === '/services/DirectProxy'){
		
	} else if((reqUrl.pathname === '/services/CBRTransportHeaderProxy')){
		
	} else if(reqUrl.pathname === '/services/CBRSOAPHeaderProxy') {
		
	} else {
		
	}
	
	
}