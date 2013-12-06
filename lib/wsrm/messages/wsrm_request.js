var WsrmMessage = require('./wsrm_message');

/*
 * This object is used store data about the requests
 * This inherits the WSRMMessage
 */

/**
 * Constructor to create a WSRMRequest object
 * @param id internally generated id for the message
 * @param payload soap message
 * @param relatedTo id of the message to which this message is related
 */
var WsrmRequest = function(id,payload,relatedTo){
  this.relatedTo = relatedTo;
  this.id= id;
  this.payload = payload;
};

WsrmRequest.prototype = WsrmMessage.prototype;

/**
 * To get the related message id
 * @returns id of message
 */
WsrmRequest.prototype.getRelatedTo=function(){
  return this.relatedTo;
}

module.exports = WsrmMessage;