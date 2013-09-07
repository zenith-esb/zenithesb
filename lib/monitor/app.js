
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , hostInfo = require('./host_info.json')
  , monitor = require('./monitor_utils/collector.js')
  , logger = require('../logger');

var app = express();

// all environments
app.set('port', process.env.PORT || hostInfo.port);
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
app.get('/memory', routes.index);
app.get('/requestInfo', routes.index);
app.get('/users', user.list);


module.exports.startDashBoard = function startDashBoard(){
	http.createServer(app).listen(app.get('port'), function(){
		  logger.info( 'ZenithMonitor', ' Express server listening on port ' + app.get('port'));
		});
}
module.exports.monitor = monitor;