
  var Sequence = function(sequenceId){
    this.sequenceId=sequenceId;
    this.desSequenceId='';
    this.lastMessageId = 0;
    this.nextToSend=1;
    this.nextToIn=1;
    this.messages = {};
    this.zenithMessages = {};
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
    return 'urn:uuid:'+this.sequenceId+'-'+this.lastMessageId;
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
  
  Sequence.prototype.getNextToSend =function (){
    return this.nextToSend++;
  }
  
  Sequence.prototype.getNextToIn =function (){
    return this.nextToIn++;
  }
  
  module.exports=Sequence;