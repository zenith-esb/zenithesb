var WSRMProcessor = require('./../wsrm/wsrm_processor.js');
var url = require('url');

var WSRMEndpoint = function(serviceUrl){
  this.wsrmProcessor = new WSRMProcessor(serviceUrl)
}



WSRMEndpoint.prototype.callService = function(message,callback){
  
  this.wsrmProcessor.process(message,callback);
}

module.exports=WSRMEndpoint;