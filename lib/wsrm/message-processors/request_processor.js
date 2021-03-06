var builder = require('./message_builder');
var soapExtractor = require('./soap_extractor');
var WsrmRequest = require('./../messages/wsrm_request');
var date = new Date();

/**
 * Sends recieved request to the Destination
 * @param wsrmPrototype WSRMProcessor instance
 * @param sequenceId sequenceId of sequence which contains the message
 * @param id of the message to be sent
 */
exports.process = function(wsrmPrototype,sequenceId,toSend){
  
  var sequence = wsrmPrototype.sequences[sequenceId];
  var messageId = sequence.getMessageId();
  var message = sequence.getMessage(toSend);
  //build the soap message
  builder.buildBasic();
  builder.appendWsaTo(wsrmPrototype.endpoint.url);
  builder.appendWsaAction({'text':message.getWsaAction()});
  builder.wsaMessageID(messageId);
  builder.appendWsrmSequence(sequence.getDesSequenceId(),toSend+"",true);
  builder.appendFragmentToBody(message.getBody());
  var creSeqMsg = builder.xmlToString();
  var wsrmRequest = new  WsrmRequest(messageId,creSeqMsg,toSend);
  wsrmRequest.setLastTimeSent( date.getTime());
  // register callback to execute if acknowledgemnt is not available
  wsrmRequest.on('noAck',function(id){
	   var msgTosend = sequence.getZenithMessage(id);
	   var payload = msgTosend.getPayload();
	   msgTosend.setLastTimeSent(date.getTime());
	   wsrmPrototype.endpoint.callService(payload,wsrmPrototype.handleResponses);
	   console.log('resent----'+id); 
  });
  
  sequence.addNewZenithMessage(messageId,wsrmRequest);
  // send the message to the destination
  wsrmPrototype.endpoint.callService(creSeqMsg,wsrmPrototype.handleResponses);
  
}