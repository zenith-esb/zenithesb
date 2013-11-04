
/*
 * GET home page.
 */
var  SysInfo = require('./../monitor_utils/server_info.js');
var  configuration = require('./../../../configuration/server_config.json');
var sysInfo = new SysInfo();
exports.index = function(req, res){
  if( (req.url=='/') || ( req.url=='/sysInfo')){
	  res.render('sysinfo',{'sysinfo':sysInfo.getPlatformInfo()}); 
  }
  else if(req.url=='/memory'){
	  res.send(sysInfo.getMemoryStat());
  }
  else if(req.url=='/requestInfo'){
	  res.render('requestInfo',{'requestInfo':sysInfo.getPerformance()}); 
  }
  
  else if(req.url=='/requestInfo?data'){
	  res.send(sysInfo.getPerformance()); 
  }
  else if(req.url=='/configurations'){
	  res.render('configurations',{'configuration':configuration}); 
  }
};