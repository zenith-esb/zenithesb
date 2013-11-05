
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , config = require('./routes/configuration')
  , http = require('http')
  , path = require('path')
  , configuration = require('./../../configuration/server_config.json')
  , monitor = require('./monitor_utils/collector.js')
  , logger = require('../logger');

var app = express();

// all environments
app.set('port', process.env.PORT || configuration.monitor.port);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/sysInfo', routes.index);
app.get('/memory', routes.index);
app.get('/requestInfo', routes.index);
app.get('/serverConfig',config.configure);
app.get('/eventConfig', config.configure);
app.get('/logConfig',config.configure);
app.get('/proxyConfig', config.configure);
app.post('/serverConfig',config.configure);
app.post('/eventConfig', config.configure);
app.post('/logConfig', config.configure);
app.post('/proxyConfig', config.configure);
app.get('/users', user.list);


module.exports.startDashBoard = function startDashBoard(){
	http.createServer(app).listen(app.get('port'), function(){
		  logger.info( 'ZenithMonitor', ' Express server listening on port ' + app.get('port'));
		});
}
module.exports.monitor = monitor;