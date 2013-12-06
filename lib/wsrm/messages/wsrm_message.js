var EventEmitter = require('events').EventEmitter,
     
util = require('util');

/*
 * This object is used to store information about messages exchange with
 * WSRM destination
 */

/**
 * Constructor to create WsrmMessage
 * @param id internally generated id for the message
 * @param payload soap request
 */
var WsrmMesage = function(id,payload){
  var self = this;
  this.id = id;
  this.payload = payload;
  this.lastTimeSent  = null;
  this.acknowledged = false;
  this.date = new Date();
  this.intId = setInterval(function(){   //Check whether acknowledgement recieves. of not fire a event
	          if((self.date.getTime()-self.lastTimeSent>5000) && !self.acknowledged){
	        	  self.emit('noAck',self.id);
	          }
	                        },4000);
}

//Inherits properties of EventEmiiter
util.inherits(WsrmMesage, EventEmitter);

/**
 * Returns the id of the message
 * 
 */
WsrmMesage.prototype.getId = function(){
  return this.id; 
}

/**
 * set the last time it sent the request
 * @param lastTimeSent time of sent, or attempt to sesnd the message
 */
WsrmMesage.prototype.setLastTimeSent = function(lastTimeSent ){
   this.lastTimeSent = lastTimeSent;
}

/**
 * Returns the time of last attempt to send
 * @returns time in milliseconds
 */
WsrmMesage.prototype.getLastTimeSent  = function(){
  return this.lastTimeSend;
}

/**
 * Returns the soap message as a string
 *
 */
WsrmMesage.prototype.getPayload = function(){
  return this.payload;
}

/**
 * Set the acknowledged property to true to indicate destination
 * has responded to request
 */
WsrmMesage.prototype.setAcknowledged = function(){
  this.acknowledged=true;
  this.cleanInterval();
}

/**
 * Stop the emitting 'NoAck' Event which indicate acknowledgement
 * has not received.
 */
WsrmMesage.prototype.cleanInterval = function(){
	clearInterval(this.intId);
}

/**
 * To check whether message has been acknowledged
 * @returns boolean
 */
WsrmMesage.prototype.getAcknowledged = function(){
  return this.acknowledged;
}

module.exports = WsrmMesage;
