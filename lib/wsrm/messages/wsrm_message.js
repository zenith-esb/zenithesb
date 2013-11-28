
var WsrmMesage = function(id,payload){
  this.id = id;
  this.payload = payload;
  this.setLastTimeSent  = null;
  this.acknowledged = false;
}

WsrmMesage.prototype.getId = function(){
  return this.id;
}

WsrmMesage.prototype.setLastTimeSent = function(setLastTimeSent ){
  return this.setLastTimeSent = setLastTimeSent;
}

WsrmMesage.prototype.getLastTimeSent  = function(lastTimeSent){
  return this.setLastTimeSend;
}

WsrmMesage.prototype.getPayload = function(){
  return this.payload;
}

WsrmMesage.prototype.setAcknowledged = function(){
  this.acknowledged=true;;
}

WsrmMesage.prototype.getAcknowledged = function(){
  return this.acknowledged;
}

module.exports = WsrmMesage;