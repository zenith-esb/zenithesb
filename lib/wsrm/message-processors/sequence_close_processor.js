
var builder = require('./message_builder');
var soapExtractor = require('./soap_extractor');

/**
 * Check whether this a sequence termination message.
 * If so clear the sequnce and messages
 */
exports.process = function(msg,wsrmPrototype){
	var regExp = new RegExp("TerminateSequence",'i');
    if(!regExp.test(msg)){
      return false;
    }
    soapExtractor.parse(msg);
    var sequenceId = soapExtractor.getTerminateSeqIdentifier();
    wsrmPrototype.sequences[sequenceId].close();
    wsrmPrototype.removeSequence(sequenceId);
}
