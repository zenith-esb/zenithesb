var builder = require('./message_builder');
var soapExtractor = require('./soap_extractor');
var WsrmRequest = require('./../messages/wsrm_request');

exports.process = function(wsrmPrototype,sequenceId,toSend,endpoint){
  
  var sequence = wsrmPrototype.sequences[sequenceId].outSequence;
  var messageId = sequence.getMessageId();
  var message = sequence.getMessage(toSend);
  builder.buildBasic();
  builder.appendWsaTo('http://localhost:9000/services/ReliableStockQuoteService');
  builder.appendWsaAction({'text':message.getWsaAction()});
  builder.wsaMessageID(messageId);
  builder.appendWsrmSequence(sequence.getDesSequenceId(),toSend+"",true);
  builder.appendFragmentToBody(message.getBody());
  var creSeqMsg = builder.xmlToString();
  var wsrmRequest = new  WsrmRequest(messageId,creSeqMsg,toSend);
  sequence.addNewZenithMessage(wsrmRequest);
  wsrmPrototype.endpoint.callService(creSeqMsg,wsrmPrototype.handleResponses);
}