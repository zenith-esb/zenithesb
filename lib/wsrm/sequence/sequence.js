
/**
 * Constructor of the Sequence object.This object store the messages send
 * in sequence.
 * 
 */
  var Sequence = function(sequenceId,sender){
    this.sequenceId=sequenceId;
    this.desSequenceId='';
    this.lastMessageId = 0;
    this.nextToSend=1;
    this.nextToIn=1;
    this.messages = {};
    this.zenithMessages = {};
    this.sender = sender;
    this.active = true;
  }
  
  
  Sequence.prototype.setDesSequenceId =function (desSequenceId){
    this.desSequenceId=desSequenceId;
  }
  
  Sequence.prototype.getDesSequenceId =function (desSequenceId){
    return this.desSequenceId;
  }
  
  Sequence.prototype.addNewMessage =function (messageId,message){
    this.messages[messageId]=message;

  }
  
  Sequence.prototype.removeMessage =function (messageId){
    delete this.messages[messageId];
  }
  
  Sequence.prototype.getMessage=function(messageId){
    return this.messages[messageId];
  }
  
  
  Sequence.prototype.setAck =function (messageId){
    this.messages[messageId].acknowledged=true;
  }
  
  
  Sequence.prototype.getMessageId =function (messgeId){
    this.lastMessageId=this.lastMessageId+1;
    return this.sequenceId+'-'+this.lastMessageId;
    
  }
  
  
  Sequence.prototype.addNewZenithMessage =function (messageId,message){
    this.zenithMessages[messageId]=message;
  }
  
  Sequence.prototype.setZenithAck =function (messageId){
    this.zenithMessages[messageId].acknowledged=true;
  }
  
  Sequence.prototype.getZenithMessage =function (messageId){
    return this.zenithMessages[messageId];
  }
  
  Sequence.prototype.removeZenithMessage =function (messageId){
    delete this.zenithMessages[messageId];
  }
  
  
  Sequence.prototype.close =function (){
	    for(var key in this.zenithMessages){
	    	this.zenithMessages[key].setAcknowledged();
	    	this.removeZenithMessage(key);
	    }
	    for(var key in this.messages){
	    	this.removeMessage(key);
	    }
  }
  
  
  Sequence.prototype.getNextToSend =function (){
    return this.nextToSend++;
  }
  
  
  Sequence.prototype.getNextToIn =function (){
    return this.nextToIn++;
  }
  
  
  Sequence.prototype.equals =function (properties){
	  for(var key in properties){
		  if(properties[key]==this[key]){
			  return true;
		  }
	  }
	  return false;
   }
  
  module.exports=Sequence;