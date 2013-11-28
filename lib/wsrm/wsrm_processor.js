var SequenceCombination = require('./sequence/sequence_combination');
var createSequenceProcessor = require('./message-processors/create_sequence_processor.js');
var createSequenceResponseProcessor = require('./message-processors/create_sequence_response_processor.js');
var acknowledgementProcessor = require('./message-processors/acknowledgement_processor.js');
var Endpoint = require('./connection.js');


var WSRMProcessor = function(serviceUrl){
  
  setEndPoint(serviceUrl);
};

WSRMProcessor.prototype.endpoint;
WSRMProcessor.prototype.lastSequenceId = 3756890;
WSRMProcessor.prototype.sequences = new Array();

function setEndPoint(serviceUrl){
  WSRMProcessor.prototype.endpoint=new Endpoint(serviceUrl);
}
WSRMProcessor.prototype.handleResponses = function(msg){

   var b = createSequenceResponseProcessor.process(msg.body,WSRMProcessor.prototype);
   if(b==undefined){
     acknowledgementProcessor.process(msg,WSRMProcessor.prototype);
   }
   else
     console.log(msg);
};


WSRMProcessor.prototype.newSequenceId = function(){
  this.lastSequenceId=this.lastSequenceId+7;
  return this.lastSequenceId;
};

WSRMProcessor.prototype.handleCreateSequence = function(msg,callback){
  var integerId  = this.newSequenceId();
  var seqId  = 'urn:uuid:'+integerId;
  this.sequences[seqId]=new SequenceCombination(integerId);
  createSequenceProcessor.process(WSRMProcessor.prototype,seqId,msg,callback);
  
};

module.exports = WSRMProcessor;