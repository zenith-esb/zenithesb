var builder = require('./message_builder');
var soapExtractor = require('./soap_extractor');
var WsrmMessage = require('./../messages/wsrm_message');
var date = new Date();

exports.process = function(msg,wsrmPrototype){
  regExp = new RegExp("SequenceAcknowledgement",'i');
  //check whether this a acknowledgement message
  if(!regExp.test(msg.body)){
    return false;
  }
  
  var dom = soapExtractor.parse(msg.body);
  var relatesTo = soapExtractor.getWsaRelatesTo();
  var messageId = soapExtractor.getWsaMessageId();
  var sequenceId= relatesTo.split("-")[0];
  var outSequence = wsrmPrototype.sequences[sequenceId];
  
  //remove the relevant message from the sequence
  outSequence.setZenithAck(relatesTo);
  outSequence.removeZenithMessage(relatesTo);
  
  var sendingId = outSequence.getMessageId();
  var lower = soapExtractor.getLowerAck();
  var upper = soapExtractor.getUpperAck();
  
  var seqInIdentifier = soapExtractor.getSeqIdntifier();
  var desSeqIdentifier = soapExtractor.getSeqAckIdentifier();
  var isLast = soapExtractor.isLast();
  
  var messageNumber = soapExtractor.getInMessageNumber();
  //build the response to send back
  builder.buildBasic(dom);
  builder.removeFaltTo();
  builder.removeRealtesTo();
  builder.removeSeqAck();
  builder.removeSeq();
  builder.removeMsgId();
  
  for(lower;lower<=upper;lower++){
    // add messageId to the response
    var message = outSequence.getMessage(lower);
    builder.wsaNsPrefixToHeader();
    builder.wsaMessageID('urn:uuid:32456');
    builder.appendWsaRelatesTo(message.getMessageId());
    var body = builder.xmlToString();
    var msgObj = message.getMsgObject();
    msgObj.body = body;
    msgObj.transportHeaders.statusCode = msg.statusCode;
    msgObj.contentType =  'text/xml';
    var callback = message.getCallback();
    callback(null, message);
  }
  
  
  if(seqInIdentifier){
     //made a acknowledgement message to end the webserive
     builder.buildBasic(); 
     builder.appendWsaTo(wsrmPrototype.endpoint.url);
     builder.wsaMessageID(sendingId);
     builder.appendSequenceAcknowledge(seqInIdentifier,messageNumber,messageNumber,false);
  }
  if(isLast){
    //append the </last> element and terminate sequence element if the response is the last
    builder.appendWsaAction({'text':'http://schemas.xmlsoap.org/ws/2005/02/rm/TerminateSequence'});
    builder.appendTerminateSeq(desSeqIdentifier);
  }
  var res = builder.xmlToString();
  
  //store the acknowledgemnt 
  var message = new WsrmMessage(sendingId,res);
  message.setLastTimeSent(date.getTime());
  
  message.on('noAck',function(id){
	   var msgTosend = outSequence.getZenithMessage(id);
	   var payload = msgTosend.getPayload();
	   msgTosend.setLastTimeSent(date.getTime());
	   wsrmPrototype.endpoint.callService(payload,wsrmPrototype.handleResponses);
	   console.log('resent----'+id);
	   
 });
  
  outSequence.addNewZenithMessage(sendingId,message);
  
  
  //send the message
  wsrmPrototype.endpoint.callService(res, wsrmPrototype.handleResponses);
}