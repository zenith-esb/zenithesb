var libxmljs = require('libxmljs');
var namespace = require('./../common/namespace');
var basic = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:wsa="http://www.w3.org/2005/08/addressing"><soapenv:Header/><soapenv:Body/></soapenv:Envelope>';
var dom=null;  
var header=null;
var body=null;

/*
 * This module is used to build soap messsages
 */

/**
 * build a basic dom containing <soapenv:Envelope><soapenv:Header><soapenv:Body> tag
 * @param preDom - dom object to be used. This is optional. If this is provided it is used to
 * append elements;
 */
exports.buildBasic = function(preDom){
  if(undefined !=preDom)
    dom=preDom;
  else
    dom = libxmljs.parseXmlString(basic);
  
  header=dom.find('//soapenv:Header',namespace)[0];
  body=dom.find('//soapenv:Body',namespace)[0];
}

/*
 * following methods can be used to append element to the do
 * buildBasic() should be called before call these methods
 */

/**
 * append <wsa:Relates> element to <wsa:Header>
 * @param messageId of related message 
 */
exports.appendWsaRelatesTo=function(messageId){
  append(header,'wsa:Relates',{'text':messageId});
}

/**
 * append <wsa:To> element to <wsa:Header>
 * @param wsaTo text of <wsa:To> element
 */
exports.appendWsaTo=function(wsaTo){
  append(header,'wsa:To',{'text':wsaTo});
}

/**
 * append <wsa:Action> element to <wsa:Header>
 * @param JSON object contains text of <wsa:Action> element and relevant attributes
 * format {text:'',attr:{attribute1:'',attrbute2:{}}
 */
exports.appendWsaAction=function (param){
  append(header,'wsa:Action',param);
}

/**
 * append <wsa:MessageID> element to <wsa:Header>
 * @param messageId - text of <wsa:MessageID> element 
 */
exports.wsaMessageID =function(messageId){
  append(header,'wsa:MessageID',{'text':messageId,'attr':{'xmlns:wsa':'http://www.w3.org/2005/08/addressing'}});
}

/**
 * append <wsrm:CreateSequence> element to <wsa:Body>
 * @param acksToAddress - text of <wsrm:AcksTo> element 
 * @param Offer - text of <wsrm:Identifier> element
 */
exports.appendCreateSequence=function(acksToAddress,Offer){
  
  var createSeq = append(body,'wsrm:CreateSequence',{'text':'','attr':{'xmlns:wsrm':'http://schemas.xmlsoap.org/ws/2005/02/rm'}});
  var acksTo = append(createSeq,'wsrm:AcksTo',{'text':''});
  append(acksTo,'wsa:Address',{'text':acksToAddress});
  var offer = append(createSeq,'wsrm:Offer',{'text':''}); 
  append(offer,'wsrm:Identifier',{'text':Offer});
  
}

/**
 * append <wsrm:TerminateSequence> element to <wsa:Body>
 * @param identifier text of <wsrm:Identifier> element 
 */
exports.appendTerminateSeq =function(identifier){
  var terminateSeq = append(body,'wsrm:TerminateSequence',{'text':'','attr':{'xmlns:wsrm':'http://schemas.xmlsoap.org/ws/2005/02/rm'}});
  append(terminateSeq,'wsrm:Identifier',{'text':identifier});
}

/**
 * append <wsrm:Sequence> element to <wsa:Header>
 * @param identifer- text of <wsrm:Identifier> element 
 * @param messageNuber - text of <wsrm:MessageNumber> element
 * @param lastMessage - text of <wsrm:LastMessage> element
 */
exports.appendWsrmSequence=function(identifer,messageNuber,lastMessage){
  
  var sequence = append(header,'wsrm:Sequence',{'text':'','attr':{'xmlns:wsrm':'http://schemas.xmlsoap.org/ws/2005/02/rm','soapenv:mustUnderstand':'1'}});
  append(sequence,'wsrm:Identifier',{'text':identifer});
  append(sequence,'wsrm:MessageNumber',{'text':messageNuber});
  if(lastMessage)
    append(sequence,'wsrm:LastMessage',{'text':''});
  
}

/**
 * append <wsrm:SequenceAcknowledgement> element to <wsa:Header>
 * @param identifer - text of <wsrm:Identifier> element 
 * @param lower - value of 'lower' attribute of <wsrm:Identifier>
 * @param upper - value of 'upper' attribute of <wsrm:Identifier>
 * @param lastMessage -  boolean value to indicate whether this is last message
 */
exports.appendSequenceAcknowledge=function(identifer,lower,upper,lastMessage){
  
  var seqAck = append(header,'wsrm:SequenceAcknowledgement',{'text':'','attr':{'xmlns:wsrm':'http://schemas.xmlsoap.org/ws/2005/02/rm','soapenv:mustUnderstand':'1'}});
  append(seqAck,'wsrm:Identifier',{'text':identifer});
  append(seqAck,'wsrm:AcknowledgementRange',{'text':'','attr':{'Lower':lower,'Upper':upper}});
  if(lastMessage)
    append(seqAck,'wsrm:LastMessage',{'text':''});
  
}

/**
 * append fragment of xml to <Body>
 * @param content - content(string)
 */
exports.appendFragmentToBody=function(content){
  var bodyCont = libxmljs.parseXmlString(content);
  var actions  = bodyCont.root();
  body.addChild(actions);
}

/**
 * return string representation of built dom
 * 
 */
exports.xmlToString=function(){
  return dom.toString();
}

/**
 * Base function used to append element.
 * It is not intended to used outside the module
 */
var append =function(parentElm,name,option){
  var child;
  var attr={};
  if(option.text)
    child = libxmljs.Element(dom,name,option.text);
  else
   child = libxmljs.Element(dom,name);
  for(var propt in option.attr){
    attr[propt]=option.attr[propt];
    child.attr(attr);
  }
  parentElm.addChild(child);
  return child;
  
}


/*
 * These method add attributes to the elemnt
 */
exports.wsaNsPrefixToHeader=function(){
  header.attr({'xmlns:wsa':'http://www.w3.org/2005/08/addressing'});
}

/*
 * Below methods are used to remove elements from the dom
 * To use these method buildBasic should to be called first
 */

/**
 * Removes <wsa:FaultTo> element from <soapenv:Header>
 */
exports.removeFaltTo=function(){
  dom.find('//soapenv:Header/wsa:FaultTo',namespace)[0].remove();
}

/**
 * Removes <wsa:RelatesTo> element from <soapenv:Header>
 */
exports.removeRealtesTo=function(){
  dom.find('//soapenv:Header/wsa:RelatesTo',namespace)[0].remove();
}

/**
 * Removes <wsrm:SequenceAcknowledgemen> element from <soapenv:Header>
 */
exports.removeSeqAck=function(){
  dom.find('//soapenv:Header/wsrm:SequenceAcknowledgement',namespace)[0].remove();
}


/**
 * Removes <wsa:MessageID> element from <soapenv:Header>
 */
exports.removeMsgId=function(){
  dom.find('//soapenv:Header/wsa:MessageID',namespace)[0].remove();
}

/**
 * Removes <wsrm:Sequence> element from <soapenv:Header>
 */
exports.removeSeq=function(){
  dom.find('//soapenv:Header/wsrm:Sequence',namespace)[0].remove();
}
