/**
 * generate SOAP error message with the error
 */

/**
 * SOAP 1.1 fault message
 * @param error message string
 */

exports.getSOAP11Fault = function(error){
	return 
	  '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">'+
            '<soap:Body>'+
              '<soap:Fault>'+
                '<faultcode>soap:Client</faultcode>'+
                '<faultstring>'+error+'</faultstring>'+
              '</soap:Fault>'+
            '</soap:Body>'+
          '</soap:Envelope>';
}
