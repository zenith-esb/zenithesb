var Sequence = require('./sequence/sequence');
var createSequenceProcessor = require('./message-processors/create_sequence_processor.js');
var createSequenceResponseProcessor = require('./message-processors/create_sequence_response_processor.js');
var acknowledgementProcessor = require('./message-processors/acknowledgement_processor.js');
var sequenceCloseProcessor = require('./message-processors/sequence_close_processor.js');
var Endpoint = require('./connection.js');
var IncomingRequest = require('./messages/incoming_request');
var extractor = require('./message-processors/soap_extractor');

//
var WSRMProcessor = function(serviceUrl){
  
  setEndPoint(serviceUrl);
  
};

WSRMProcessor.prototype.endpoint;
WSRMProcessor.prototype.lastSequenceId = 3756890;
WSRMProcessor.prototype.sequences = new Array();

/**
 * set the url of end poitn
 * @param serviceUrl Url of the WSRM destination
 * 
 */
function setEndPoint(serviceUrl){
  WSRMProcessor.prototype.endpoint=new Endpoint(serviceUrl);
}

/**
 * Handle responses of the WSRM destination
 * This function is passed as callback function to end point to
 * execute after it recieves the end point
 */
 WSRMProcessor.prototype.handleResponses = function(msg){
   var sequenceRespose = createSequenceResponseProcessor.process(msg.body,WSRMProcessor.prototype);
   if(sequenceRespose==false){
    var acknowledgement= acknowledgementProcessor.process(msg,WSRMProcessor.prototype);
    if(acknowledgement==false){
    	var sequenceClose = sequenceCloseProcessor.process(msg.body,WSRMProcessor.prototype);
    }
   }
};

/**
 * Returns a new sequence id 
 */
WSRMProcessor.prototype.newSequenceId = function(){
  this.lastSequenceId=this.lastSequenceId+7;
  return this.lastSequenceId;
};

/**
 * Create a new sequence with WSRM destination to send the message
 * @param msg Zenith message object
 * @param callback callback function to be execute after receiving the response
 */
WSRMProcessor.prototype.handleCreateSequence = function(msg,callback){
	
  var integerId  = this.newSequenceId();
  var seqId  = 'urn:uuid:'+integerId;
  this.sequences[seqId]=new Sequence(seqId,msg.sender);
  this.buildInMessage(msg,callback,seqId);
  createSequenceProcessor.process(WSRMProcessor.prototype,seqId);
  
};

/**
 * Main method of the WSRM component. This is called by WSRM endpoint.If a sequence exists
 * it is used to send the message. If not create a new Sequence.
* @param msg Zenith message object
 * @param callback callback function to be execute after receiving the response.
 */
WSRMProcessor.prototype.process = function(msg,callback){	   
	   var sender = msg.sender;
	   var exist = false;
	   var sequenceId = null;
	   for(var key in this.sequences){
		  if( this.sequences[key].equals({'sender':sender}) && this.sequences[key].active){
			  exist=true;
			  sequenceId=key;
			  break;
		  }
	   }	   
	   if(!exist){
		  this.handleCreateSequence(msg, callback)
	   }
	  else{  
		   this.buildInMessage(msg,callback,sequenceId);
		   requestProcessor.process(wsrmPrototype,sequenceId,sequence.getNextToSend());
	  }
	 
	  
};

/**
 * Build a message object to be used in WSRM module.
 * @param msg Zenith message object
 * @param callback callback function to be execute after receiving the response.
 * @param sequenceId sequnceId of the message
 */
WSRMProcessor.prototype.buildInMessage = function(msg,callback,sequenceId){
	
	   var sequence = this.sequences[sequenceId];
	   extractor.parse(msg.body);
	   var reqMessage = new IncomingRequest();
	   reqMessage.setMessageId(extractor.getWsaMessageId());
	   reqMessage.setBody(extractor.getBody());
	   reqMessage.setWsaAction(extractor.getWsaAction());  
	   var sendOrder = sequence.getNextToIn();
	   reqMessage.setMsgObject(msg)
	   reqMessage.setCallback(callback);
	   sequence.addNewMessage(sendOrder,reqMessage);

};
	
/**
 * remove a sequence from the array of sequences
 * @param Id of sequence to be removed
 */
WSRMProcessor.prototype.removeSequence = function(sequenceId){
	delete this.sequences[sequenceId];
}

module.exports = WSRMProcessor;