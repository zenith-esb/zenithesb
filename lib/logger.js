/**
 * Module for logging
 */
var log4js = require('log4js');

//configure the log4j
var config = require('../configuration/log_config');

log4js.configure(config.configuration);

var logger;
var LOG_LEVEL = config.logLevel;


module.exports = {
		
		trace : function(loggingScope, message){
			logger = log4js.getLogger('['+loggingScope+']');
			logger.setLevel(LOG_LEVEL);
			logger.trace(message);		
			
		},
		debug : function(loggingScope, message){
			logger = log4js.getLogger('['+loggingScope+']');
			logger.setLevel(LOG_LEVEL);
			logger.debug(message);
			
		},
		info : function(loggingScope, message){
			logger = log4js.getLogger('['+loggingScope+']');
			logger.setLevel(LOG_LEVEL);
			logger.info(message);			
			
		},
		warn : function(loggingScope, message){
			logger = log4js.getLogger('['+loggingScope+']');
			logger.setLevel(LOG_LEVEL);
			logger.warn(message);			
			
		},
		error : function(loggingScope, message){
			logger = log4js.getLogger('['+loggingScope+']');
			logger.setLevel(LOG_LEVEL);
			logger.error(message);			
			
		},
		fatal : function(loggingScope, message){
			logger = log4js.getLogger('['+loggingScope+']');
			logger.setLevel(LOG_LEVEL);
			logger.fatal(message);
			
		}
			
		
}