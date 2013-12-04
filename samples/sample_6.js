/**
 * Message mediation scenario. Send the message defined in the SOAP
 * WS-Addressing EPR value.
 */

var SUPPORT_LIBS = '../lib/support/';
var logger = require('../lib/logger');
var saxProcessor = require(SUPPORT_LIBS + 'xml/sax_processor');
var soapErrorMsg = require('../lib/util/errormsg/soap_err_msg');
var zenithErrorMsg = require('../lib/util/errormsg/zenith_err_msg');
var WSRMEndPoint  = require('./../lib/support/wsrm_endpoints');
var endpoints = {}

endpoints['RelStockQuote']=new WSRMEndPoint('http://localhost:9000/services/ReliableStockQuoteService');


exports.executeSample = function(zenithMessage, callback){

    var serviceAction;     
    
    //this defines the header field values in the soap message. 
    var soapHeaderElement = 'Action';
    var soapHeaderElementNmSpcURI = 'http://www.w3.org/2005/08/addressing';
    
    
    var saxProcessor = require(SUPPORT_LIBS + 'xml/sax_processor');

    saxProcessor.getElementValue(zenithMessage.body, 
            soapHeaderElementNmSpcURI, soapHeaderElement, function(err, value){
                
        if(err == null){ // no error    
          serviceAction = value[0];
            //logger.debug('SampleConfig', 'EPR: ' + serviceURL);         
           if(serviceAction=='urn:getQuote'){
             endpoints['RelStockQuote'].callService(zenithMessage,function(err,message){      
               if(!err){
                 
                 callback(null, message);    
             } else {
                 //send error message for error situation
                 //can create more detailed errors by reading fields in 'err' object
                 var errMsg = soapErrorMsg.getSOAP11Fault('Connection Refused.'); 
                 var errZenithMessage = zenithErrorMsg.getZenithErrorMSG(errMsg, 'text/xml', '503');
                 callback(null, errZenithMessage);
             }   
         }); 
           }  
             
             
     } else {
             //set the message body to the error message
         var errMsg = soapErrorMsg.getSOAP11Fault('Error in SAX processing unite.'); 
         var errZenithMessage = zenithErrorMsg.getZenithErrorMSG(errMsg, 'text/xml', '500');
         callback(null, errZenithMessage);
           }

        
        
        /*  var endpoint = require(SUPPORT_LIBS + 'ws_endpoint');
                
            endpoint.callService(zenithMessage, option, function(err,message){      
                if(!err){
                    
                    callback(null, message);    
                } else {
                    //send error message for error situation
                    //can create more detailed errors by reading fields in 'err' object
                    var errMsg = soapErrorMsg.getSOAP11Fault('Connection Refused.'); 
                    var errZenithMessage = zenithErrorMsg.getZenithErrorMSG(errMsg, 'text/xml', '503');
                    callback(null, errZenithMessage);
                }   
            }); 
                
                
                
        } else {
                //set the message body to the error message
            var errMsg = soapErrorMsg.getSOAP11Fault('Error in SAX processing unite.'); 
            var errZenithMessage = zenithErrorMsg.getZenithErrorMSG(errMsg, 'text/xml', '500');
            callback(null, errZenithMessage);
        }
        */
        
    });
    
}