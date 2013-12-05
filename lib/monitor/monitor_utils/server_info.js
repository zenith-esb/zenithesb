var os = require('os');
var collector = require('./collector.js');
var configuration = require('./../../../configuration/server_config.json');

SysInfo = function(){
      
}
/**
 * returns the information of host
 */
SysInfo.prototype.getPlatformInfo =  function(){
                var totMem = (os.totalmem()/(1024*1024));
                totMem = totMem+" MB";
                var platform = os.platform();
                var type = os.type();
                var hostName = os.hostname();
                return {'memory':totMem,'platform':platform,'type':type,'hostname':hostName};
}

/**
 * Returns the memory status of host at that moment
 */
SysInfo.prototype.getMemoryStat = function(){
          var amb = (os.totalmem()-os.freemem());
          var mb = amb/(1024*1024);
          var psMemory = process.memoryUsage();
          var totHeap = psMemory.heapTotal/(1024*1024);
          var usedHeap = psMemory.heapUsed/(1024*1024);
          return {     'sysmemory':mb,
                        'heapTotal':totHeap,
                        'heapUsed':usedHeap
                        };
}

/**
 * Returns Json object which contains information about
 * request information
 * 
 */
SysInfo.prototype.getPerformance = function(){
          return collector.getStat(); 
}

module.exports = SysInfo;