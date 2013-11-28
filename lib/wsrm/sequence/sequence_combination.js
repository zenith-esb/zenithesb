var Sequence = require('./sequence');

var SequenceCombination = function(id){
  this.id=id;
  this.inSequence = new Sequence(id);
  this.outSequence = new Sequence(id);
}

module.exports = SequenceCombination;