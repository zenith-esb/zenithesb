var os = require('os');
var collector = require('./collector.js');

SysInfo = function(){

}
SysInfo.prototype.getPlatformInfo =  function(){
		var totMem = (os.totalmem()/(1024*1024));
		totMem = totMem+" MB";
		var platform = os.platform();
		var type = os.type();
		var hostName = os.hostname();
		return {'memory':totMem,'platform':platform,'type':type,'hostname':hostName};
	}

SysInfo.prototype.getMemoryStat = function(){
	  var amb = (os.totalmem()-os.freemem());
	  var mb = amb/(1024*1024);
	  var psMemory = process.memoryUsage();
	  var totHeap = psMemory.heapTotal/(1024*1024);
	  var usedHeap = psMemory.heapUsed/(1024*1024);
	  return {	'sysmemory':mb,
		        'heapTotal':totHeap,
		        'heapUsed':usedHeap
		        };
}

SysInfo.prototype.getPerformance = function(){
	  return collector.getMonitorTotalResult(false); 
}

module.exports = SysInfo;
