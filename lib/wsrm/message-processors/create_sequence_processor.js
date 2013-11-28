var libxmljs = require("libxmljs");
var namespace = require('./../common/namespace.json');
var builder = require('./message_builder');
var extractor = require('./soap_extractor');
var IncomingRequest = require('./../messages/incoming_request');
var WsrmMessage = require('./../messages/wsrm_message');

exports.process = function (wsrmPrototype,sequenceId,clientMsg,callBack){
   
   var outSequence =  wsrmPrototype.sequences[sequenceId].outSequence;
   
   extractor.parse(clientMsg.body);
   
   var reqMessage = new IncomingRequest();
   reqMessage.setMessageId(extractor.getWsaMessageId());
   reqMessage.setBody(extractor.getBody());
   reqMessage.setWsaAction(extractor.getWsaAction());
   
   var sendOrder = outSequence.getNextToIn();

   reqMessage.setMsgObject(clientMsg)
   reqMessage.setCallback(callBack);
   
   outSequence.addNewMessage(sendOrder,reqMessage);
   
   var internalId = outSequence.getMessageId();
   
   builder.buildBasic();
   builder.appendWsaTo(extractor.getWsaTo());
   builder.appendWsaAction({'text':'http://docs.oasis-open.org/ws-rx/wsrm/200702/CreateSequence','attr':{'soapenv:mustUnderstand':'1'}});
   builder.wsaMessageID(internalId);
   builder.appendCreateSequence('http://127.0.0.1:1337/',sequenceId);
   var creSeqMsg = builder.xmlToString();
   var internalId = outSequence.getMessageId();
   
   var wsrmMessage = new WsrmMessage(internalId,creSeqMsg);

   outSequence.addNewZenithMessage(internalId ,wsrmMessage);

   wsrmPrototype.endpoint.callService(creSeqMsg,wsrmPrototype.handleResponses);
 }
