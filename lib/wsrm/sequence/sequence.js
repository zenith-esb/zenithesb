
/*
 * This object store message object sent to the destination
 */
/**
 * Constructor of the Sequence object.
 * @param sequenceId internally generated id for sequence
 * @param sender Sender of the message
 * 
 */
  var Sequence = function(sequenceId,sender){
    this.sequenceId=sequenceId; //id of the sequence
    this.desSequenceId=''; // destination sequence id
    this.lastMessageId = 0; //id of lastly generated message
    this.nextToSend=1; // next message to be sent
    this.nextToIn=1;  // indicator how many messages in the queue
    this.messages = {}; // object to store messages received from application source
    this.zenithMessages = {}; //object to store sent messages to application destination
    this.sender = sender; // Application source
    this.active = true; // indicate whether sequence currently active
  }
  
  /**
   * Set the offered sequence id 
   * @param desSequenceId offered sequence id 
   */
  Sequence.prototype.setDesSequenceId =function (desSequenceId){
    this.desSequenceId=desSequenceId;
  }
  
  /**
   * To get the destination sequence Id
   * @returns destination sequence Id
   */
  Sequence.prototype.getDesSequenceId =function (){
    return this.desSequenceId;
  }
  
  /**
   * Add new message to the sequence
   * @param messageId internally generated id for the message
   * @param message message object
   */
  Sequence.prototype.addNewMessage =function (messageId,message){
    this.messages[messageId]=message;

  }
  
  /**
   * Remove a message from sequence
   * @param id of the message to be removed
   */
  Sequence.prototype.removeMessage =function (messageId){
    delete this.messages[messageId];
  }
  
  /**
   * To get a message object
   * @param messageId Id of the message
   */
  Sequence.prototype.getMessage=function(messageId){
    return this.messages[messageId];
  }
  
  /**
   * Set Acknowledged to true of a message
   * @param messageId Id of the message
   */
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