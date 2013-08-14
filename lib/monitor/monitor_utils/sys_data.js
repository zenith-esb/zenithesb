var os = require('os');


exports.sendData = function(req, res){
  var amb = (os.totalmem()-os.freemem());
  var mb = amb/(1024*1024);
  var psMemory = process.memoryUsage();
  var totHeap = psMemory.heapTotal/(1024*1024);
  var usedHeap = psMemory.heapUsed/(1024*1024);
  res.send({'sysmemory':mb,
	        'heapTotal':totHeap,
	        'heapUsed':usedHeap
	        });
};