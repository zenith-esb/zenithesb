var requestProcessor = require('./request_processor.js');
var soapExtractor = require('./soap_extractor');

exports.process = function(msg,wsrmPrototype,endpoint){
  
    regExp = new RegExp("CreateSequenceResponse",'i');
    if(!regExp.test(msg)){
      return;
    }
    soapExtractor.parse(msg);
    var relatesTo = soapExtractor.getWsaRelatesTo();
    var array = relatesTo.split("-");
    var sequenceId = array[0];
    
    var sequence =  wsrmPrototype.sequences[sequenceId].outSequence;
    
    sequence.removeZenithMessage(relatesTo);
    var deSequenceId =soapExtractor.getCreSeqIdntifier();
    sequence.setDesSequenceId(deSequenceId);

    requestProcessor.process(wsrmPrototype,sequenceId,sequence.getNextToSend(),endpoint);
  
}