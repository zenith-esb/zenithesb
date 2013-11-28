

var InComingRequest= function(){
   var messageId=null;
   var body=null;;
   var from=null;
   var response=null;
   var callback=null;
   var wsaAction=null;
   var msgObject=null;
 }
 
 InComingRequest.prototype.setMessageId = function(messageId){
   this.messageId = messageId;
 }
 
 InComingRequest.prototype.getMessageId = function(){
   return this.messageId;
 }
 
 InComingRequest.prototype.setWsaAction= function(action){
   this.action = action;
 }
 
 InComingRequest.prototype.getWsaAction = function(action){
   return this.action;
 }
 
 InComingRequest.prototype.setBody = function(body){
   this.body = body;
 }
 
 InComingRequest.prototype.getBody = function(){
   return this.body;
 }
 
 InComingRequest.prototype.setFrom = function(from){
   this.from = from;
 }
 
 InComingRequest.prototype.getFrom = function(){
   return this.from;
 }
 
 InComingRequest.prototype.setResponse = function(response){
   this.response = response;
 }
 
 InComingRequest.prototype.getResponse = function(){
   return this.response;
 }
 
 InComingRequest.prototype.setCallback = function(callback){
   this.callback = callback;
 }
 
 InComingRequest.prototype.getCallback = function(callback){
   return this.callback;
 }
 
 InComingRequest.prototype.setMsgObject= function(msgObject){
   this.msgObject = msgObject;
 }
 
 InComingRequest.prototype.getMsgObject = function(msgObject){
   return this.msgObject;
 }

 module.exports = InComingRequest;