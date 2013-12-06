/*
 * This object is used to store information request of a source
 */

var InComingRequest= function(){
   var messageId=null;
   var body=null;;
   var from=null;
   var response=null;
   var callback=null;
   var wsaAction=null;
   var msgObject=null;
   
 }
 
/**
 * Set the id of messge object
 * @param messageId id of the message
 */
 InComingRequest.prototype.setMessageId = function(messageId){
   this.messageId = messageId;
 }
 
 /**
  * Returns Id of message
  */
 InComingRequest.prototype.getMessageId = function(){
   return this.messageId;
 }
 
 /**
  * Set the <wsa:Action> of message object
  * @param action text of <wsa:Action> tag
  */
 InComingRequest.prototype.setWsaAction= function(action){
   this.action = action;
 }
 
 /**
  * Returns the wsa action
  */
 InComingRequest.prototype.getWsaAction = function(action){
   return this.action;
 }
 
 /**
  * Set the body of messge object
  * @param body content inside the <Body> tag
  */
 InComingRequest.prototype.setBody = function(body){
   this.body = body;
 }
 
 /**
  * Returns body of message
  */
 InComingRequest.prototype.getBody = function(){
   return this.body;
 }
 
 /**
  * Set the source of message object
  * @param from source of the message
  */
 InComingRequest.prototype.setFrom = function(from){
   this.from = from;
 }
 
 /**
  * Returns the source of message
  */
 InComingRequest.prototype.getFrom = function(){
   return this.from;
 }
 
 /**
  * Set the response received from the destination 
  * @param response response
  */
 InComingRequest.prototype.setResponse = function(response){
   this.response = response;
 }
 
 /**
  * Returns response
  */
 InComingRequest.prototype.getResponse = function(){
   return this.response;
 }
 
 /**
  * Set the callback function 
  * @param callback callback function
  */
 InComingRequest.prototype.setCallback = function(callback){
   this.callback = callback;
 }
 
 /**
  * Returns Id of message
  */
 InComingRequest.prototype.getCallback = function(){
   return this.callback;
 }
 
 /**
  * Set the id of messgeObject
  * @param msgObject Zenith message object created for this request
  */
 InComingRequest.prototype.setMsgObject= function(msgObject){
   this.msgObject = msgObject;
 }
 
 /**
  * Returns Id of message Object
  */
 InComingRequest.prototype.getMsgObject = function(){
   return this.msgObject;
 }

 module.exports = InComingRequest;