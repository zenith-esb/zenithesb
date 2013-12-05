var WsrmMessage = require('./wsrm_message');

/**
 * This object is used store data about the requests
 * This inherits the WSRMMessage
 */
var WsrmRequest = function(id,payload,relatedTo){
  this.relatedTo = relatedTo;
  this.id= id;
  this.payload = payload;
};

WsrmRequest.prototype = WsrmMessage.prototype;

WsrmRequest.prototype.getRelatedTo=function(){
  return this.relatedTo;
}

module.exports = WsrmMessage;