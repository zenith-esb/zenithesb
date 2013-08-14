
/*
 * GET home page.
 */
var  SysInfo = require('./../monitor_utils/server_info.js');
var  hostInfo = require('./../host_info.json');

var url = hostInfo.host+":"+hostInfo.port;
var sysInfo = new SysInfo();
exports.index = function(req, res){
  if( req.url=='/'){
	  res.render('sysinfo',{'sysinfo':sysInfo.getPlatformInfo(),'url':url}); 
  }
  else if(req.url=='/memory'){
	  res.send(sysInfo.getMemoryStat());
  }
  else if(req.url=='/requestInfo'){
	  res.render('requestInfo',{'requestInfo':sysInfo.getPerformance(),'url':url}); 
  }
  
  else if(req.url=='/requestInfo?data'){
	  res.send(sysInfo.getPerformance()); 
  }
};