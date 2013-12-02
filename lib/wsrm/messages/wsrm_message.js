var EventEmitter = require('events').EventEmitter,
     
util = require('util');


var WsrmMesage = function(id,payload){
  var self = this;
  this.id = id;
  this.payload = payload;
  this.lastTimeSent  = null;
  this.acknowledged = false;
  this.date = new Date();
  this.intId = setInterval(function(){
	          if((self.date.getTime()-self.lastTimeSent>5000) && !self.acknowledged){
	        	  self.emit('noAck',self.id);
	          }
	                        },4000);
}

util.inherits(WsrmMesage, EventEmitter);

WsrmMesage.prototype.getId = function(){
  return this.id; 
}

WsrmMesage.prototype.setLastTimeSent = function(lastTimeSent ){
   this.lastTimeSent = lastTimeSent;
}

WsrmMesage.prototype.getLastTimeSent  = function(){
  return this.lastTimeSend;
}

WsrmMesage.prototype.getPayload = function(){
  return this.payload;
}

WsrmMesage.prototype.setAcknowledged = function(){
  this.acknowledged=true;
  this.cleanInterval();
}

WsrmMesage.prototype.cleanInterval = function(){
	clearInterval(this.intId);
}

WsrmMesage.prototype.getAcknowledged = function(){
  return this.acknowledged;
}

module.exports = WsrmMesage;
