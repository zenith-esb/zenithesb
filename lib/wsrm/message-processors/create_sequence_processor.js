var libxmljs = require("libxmljs");
var namespace = require('./../common/namespace.json');
var builder = require('./message_builder');
var IncomingRequest = require('./../messages/incoming_request');
var WsrmMessage = require('./../messages/wsrm_message');
var date = new Date();

/**
 * Send a CreateSequnce message to the destination
 * @param wsrmPrototype instance of WSRMProcessor
 * @param sequenceId sequenceId to be used
 */
exports.process = function (wsrmPrototype,sequenceId){
   var outSequence =  wsrmPrototype.sequences[sequenceId];  
   var internalId = outSequence.getMessageId();
   
   //build the soap message
   builder.buildBasic();
   builder.appendWsaTo(wsrmPrototype.endpoint.url);
   builder.appendWsaAction({'text':'http://docs.oasis-open.org/ws-rx/wsrm/200702/CreateSequence','attr':{'soapenv:mustUnderstand':'1'}});
   builder.wsaMessageID(internalId);
   builder.appendCreateSequence('http://127.0.0.1:1337/',sequenceId);
   var creSeqMsg = builder.xmlToString();   
   var wsrmMessage = new WsrmMessage(internalId,creSeqMsg);
   wsrmMessage.setLastTimeSent(date.getTime());
   //add message object to the sequnce
   outSequence.addNewZenithMessage(internalId ,wsrmMessage);
   
   //register a callback function to execute when acknowledgemnt is not available
   wsrmMessage.on('noAck',function(id){
	   var msgTosend = outSequence.getZenithMessage(id);
	   var payload = msgTosend.getPayload();
	   msgTosend.setLastTimeSent(date.getTime());
	   wsrmPrototype.endpoint.callService(payload,wsrmPrototype.handleResponses);
	   console.log('resent----'+id);
   })
   
   //send the message to end point
   wsrmPrototype.endpoint.callService(creSeqMsg,wsrmPrototype.handleResponses);
 }
