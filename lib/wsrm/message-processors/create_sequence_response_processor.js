var requestProcessor = require('./request_processor.js');
var soapExtractor = require('./soap_extractor');

/**
 * Handles the message with CreateSequenceResponse tag
 * @param msg Zenith message object
 * @param WSRMProcessor instance
 */
exports.process = function(msg,wsrmPrototype){
  
    var regExp = new RegExp("CreateSequenceResponse",'i');
    if(!regExp.test(msg)){
      return false;
    }
    soapExtractor.parse(msg);
    var relatesTo = soapExtractor.getWsaRelatesTo();
    var array = relatesTo.split("-");
    var sequenceId = array[0];
    
    var sequence =  wsrmPrototype.sequences[sequenceId];
    sequence.setZenithAck(relatesTo);
    sequence.removeZenithMessage(relatesTo);
    var deSequenceId =soapExtractor.getCreSeqIdntifier();
    sequence.setDesSequenceId(deSequenceId);

    requestProcessor.process(wsrmPrototype,sequenceId,sequence.getNextToSend());
  
}