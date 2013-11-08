var fs = require('fs');
exports.configure = function(req, res){
	if(req.url=='/serverConfig'){
		if(req.method=='GET'){
			var file = __dirname+ '/../../../configuration/server_config.json';
			fs.readFile(file, 'utf8', function (err, data) {
			     if (err) throw err;
			     res.render('configEditor',{'configData':data,'type':'json','url':'/serverConfig','topic':'Zenith Server Configuration' });
			});
		}
		if(req.method=='POST'){
			var file = __dirname+ '/../../../configuration/server_config.json';
			var data =  req.body.config;
			fs.writeFile(file, data, function(err) {
			    if(err) {
			    	res.send("Error");
			    } else {
			    	res.send("Sucessfully updated");
			    }
			});
		}
	}
	
	if(req.url=='/eventConfig'){
		if(req.method=='GET'){
			var file = __dirname+ '/../../../configuration/event_config.json';
			fs.readFile(file, 'utf8', function (err, data) {
			     if (err) throw err;
			     res.render('configEditor',{'configData':data,'type':'json','url':'/eventConfig','topic':'Events Configuration'});
			});
		}
		if(req.method=='POST'){
			var file = __dirname+ '/../../../configuration/event_config.json';
			var data =  req.body.config;
			fs.writeFile(file, data, function(err) {
			    if(err) {
			    	res.send("Error");
			    } else {
			    	res.send("Sucessfully updated");
			    }
			});
		}
	}
	
	if(req.url=='/logConfig'){
		if(req.method=='GET'){
			var file = __dirname+ '/../../../configuration/log_config.json';
			fs.readFile(file, 'utf8', function (err, data) {
			     if (err) throw err;
			     res.render('configEditor',{'configData':data,'type':'json','url':'/logConfig','topic':'Log Configuration'});
			});
		}
		if(req.method=='POST'){
			var file = __dirname+ '/../../../configuration/log_config.json';
			var data =  req.body.config;
			fs.writeFile(file, data, function(err) {
			    if(err) {
			    	res.send("Error");
			    } else {
			    	res.send("Sucessfully updated");
			    }
			});
		}
	}
	if(req.url=='/proxyConfig'){
		if(req.method=='GET'){
			var file = __dirname+ '/../../../configuration/service_config.json';
			fs.readFile(file, 'utf8', function (err, data) {
			     if (err) throw err;
			     res.render('configEditor',{'configData':data,'type':'json','url':'/proxyConfig','topic':'Proxy Configuration'});
			});
		}
		if(req.method=='POST'){
			var file = __dirname+ '/../../../configuration/service_config.json';
			var data =  req.body.config;
			fs.writeFile(file, data, function(err) {
			    if(err) {
			    	res.send("Error");
			    } else {
			    	res.send("Sucessfully updated");
			    }
			});
		}
	}
	if(req.url=='/zenithConfig'){
		if(req.method=='GET'){
			var file = __dirname+ '/../../../configuration/zenith_configuration.js';
			fs.readFile(file, 'utf8', function (err, data) {
			     if (err) throw err;
			     res.render('configEditor',{'configData':data,'type':'javascript','url':'/zenithConfig','topic':'Zenith Configuration'});
			});
		}
		if(req.method=='POST'){
			var file = __dirname+ '/../../../configuration/zenith_configuration.js';
			var data =  req.body.config;
			fs.writeFile(file, data, function(err) {
			    if(err) {
			    	res.send("Error");
			    } else {
			    	res.send("Sucessfully updated");
			    }
			});
		}
	}
}