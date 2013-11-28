var endpoint = require('./../endpoint.js');
var builder = require('./message_builder');
var soapExtractor = require('./soap_extractor');

exports.process = function(msg,wsrmPrototype,sequenceId){
  var sequence = wsrmPrototype.sequnces[sequenceId].outsequence;
  var messageId = sequence.getMessageId;
  builder.buildBasic();
  builder.appendWsaTo('http://localhost:9000/services/ReliableStockQuoteService');
  builder.appendWsaAction({'text':'http://schemas.xmlsoap.org/ws/2005/02/rm/TerminateSequence'});
  builder.wsaMessageID(messageId);
  builder.appendCreateSequence('http://www.w3.org/2005/08/addressing/anonymous',sequenceId);
  
}
