var libxmljs = require('libxmljs');
var namespace = require('./../common/namespace');
var dom;

/*This module is used to extract text and attributes from soap messages.
 * 
 */

/**
 * parse the given xml file
 * @param xml - xml string to parse
 */
exports.parse=function(xml){
  dom=libxmljs.parseXmlString(xml);
  return dom;
};

/**
 * get text of the elemnt located in xpath (//soapenv:Header/wsa:To)
 * @param preDom dom object from which the text is extract this is option if
 * parse function was called before.
 */
exports.getWsaTo = function(preDom){
  if(undefined == preDom)
    return dom.find('//soapenv:Header/wsa:To',namespace)[0].text();
  else
    return preDom.find('//soapenv:Header/wsa:To',namespace)[0].text();
}

/**
 * get text of the elemnt located in xpath (//soapenv:Header/wsa:Action)
 * @param preDom dom object from which the text is extract this is option if
 * parse function was called before.
 */
exports.getWsaAction = function(preDom){
  if(undefined == preDom)
    return dom.find('//soapenv:Header/wsa:Action',namespace)[0].text();
  else
    return preDom.find('//soapenv:Header/wsa:Action',namespace)[0].text();
}

/**
 * get text of the elemnt located in xpath (//soapenv:Header/wsa:RelatesTo)
 * @param preDom dom object from which the text is extract this is option if
 * parse function was called before.
 */
exports.getWsaRelatesTo = function(preDom){
  if(undefined == preDom)
    return dom.find('//soapenv:Header/wsa:RelatesTo',namespace)[0].text();
  else
    return preDom.find('//soapenv:Header/wsa:RelatesTo',namespace)[0].text();
}

/**
 * get text of the elemnt located in xpath (//soapenv:Header/wsa:MessageID)
 * @param preDom dom object from which the text is extract this is option if
 * parse function was called before.
 */
exports.getWsaMessageId = function(preDom){
  if(undefined == preDom)
    return dom.find('//soapenv:Header/wsa:MessageID',namespace)[0].text();
  else
    return preDom.find('//soapenv:Header/wsa:MessageID',namespace)[0].text();
}

/**
 * get text of the elemnt located in xpath (//soapenv:Header/wsa:RelatesTo)
 * @param preDom dom object from which the text is extract this is option if
 * parse function was called before.
 */
exports.getWsaRelatesTo = function(preDom){
  if(undefined == preDom)
    return dom.find('//soapenv:Header/wsa:RelatesTo',namespace)[0].text();
  else
    return preDom.find('//soapenv:Header/wsa:RelatesTo',namespace)[0].text();
    
    
}

/**
 * get text of the elemnt located in xpath (//soapenv:Header//wsrm:SequenceAcknowledgement/wsrm:AcknowledgementRange/@Lower)
 * @param preDom dom object from which the text is extract this is option if
 * parse function was called before.
 */
exports.getLowerAck = function(preDom){
  if(undefined == preDom)
    return dom.find('//soapenv:Header//wsrm:SequenceAcknowledgement/wsrm:AcknowledgementRange/@Lower',namespace)[0].value();
  else
    return preDom.find('//soapenv:Header//wsrm:SequenceAcknowledgement/wsrm:AcknowledgementRange/@Lower',namespace)[0].value();
}

/**
 * get text of the elemnt located in xpath (//soapenv:Header//wsrm:SequenceAcknowledgement/wsrm:AcknowledgementRange/@Upper)
 * @param preDom dom object from which the text is extract this is option if
 * parse function was called before.
 */
exports.getUpperAck = function(preDom){
  if(undefined == preDom)
    return dom.find('//soapenv:Header//wsrm:SequenceAcknowledgement/wsrm:AcknowledgementRange/@Upper',namespace)[0].value();
  else
    return preDom.find('//soapenv:Header//wsrm:SequenceAcknowledgement/wsrm:AcknowledgementRange/@Upper',namespace)[0].value();
}

/**
 * get text of the elemnt located in xpath (//soapenv:Header/wsrm:Sequence/wsrm:Identifier)
 * @param preDom dom object from which the text is extract this is option if
 * parse function was called before.
 */
exports.getSeqIdntifier = function(preDom){
  if(undefined == preDom)
    return dom.find('//soapenv:Header/wsrm:Sequence/wsrm:Identifier',namespace)[0].text();
  else 
    return preDom.find('//soapenv:Header/wsrm:Sequence/wsrm:Identifier',namespace)[0].text();
}

/**
 * get text of the elemnt located in xpath (//soapenv:Body/wsrm:CreateSequenceResponse/wsrm:Identifier)
 * @param preDom dom object from which the text is extract this is option if
 * parse function was called before.
 */
exports.getCreSeqIdntifier = function(preDom){ 
  if(undefined == preDom)
    return dom.find('//soapenv:Body/wsrm:CreateSequenceResponse/wsrm:Identifier',namespace)[0].text();
  else 
    return preDom.find('//soapenv:Body/wsrm:CreateSequenceResponse/wsrm:Identifier',namespace)[0].text();
}

/**
 * get text of the elemnt located in xpath (//soapenv:Header/wsrm:Sequence/wsrm:MessageNumber)
 * @param preDom dom object from which the text is extract this is option if
 * parse function was called before.
 */
exports.getInMessageNumber = function(preDom){
  if(undefined == preDom)
    return dom.find('//soapenv:Header/wsrm:Sequence/wsrm:MessageNumber',namespace)[0].text();
  else 
    return preDom.find('//soapenv:Header/wsrm:Sequence/wsrm:MessageNumber',namespace)[0].text();
}

/**
 * get text of the elemnt located in xpath (//soapenv:Header/wsrm:Sequence/wsrm:LastMessage)
 * @param preDom dom object from which the text is extract this is option if
 * parse function was called before.
 */
exports.isLast = function(preDom){
  var elmArray ;
  if(undefined == preDom)
   elmArray = dom.find('//soapenv:Header/wsrm:Sequence/wsrm:LastMessage',namespace);
  else 
    elmArray = preDom.find('//soapenv:Header/wsrm:Sequence/wsrm:LastMessager',namespace);
  if(elmArray)
    return true;
}

/**get the fragment string of located in <body> tag xpath 
 * @param preDom dom object from which the text is extract this is option if
 * parse function was called before.
 */
exports.getBody= function(preDom){
  var childs;
  if(undefined == preDom)
    childs = dom.find('//soapenv:Body',namespace)[0].childNodes();
  else
    childs = preDom.find('//soapenv:Body',namespace)[0].childNodes();
  var bodyString='';
  for (var key in childs) {
    bodyString=bodyString+childs[key].toString();
  }
  return bodyString;
}

/**
 * get text of the elemnt located in xpath (//soapenv:Header/wsrm:SequenceAcknowledgement/wsrm:Identifier)
 * @param preDom dom object from which the text is extract this is option if
 * parse function was called before.
 */
exports.getSeqAckIdentifier = function(preDom){
  if(undefined == preDom)
    return dom.find('//soapenv:Header/wsrm:SequenceAcknowledgement/wsrm:Identifier',namespace)[0].text();
  else 
    return preDom.find('//soapenv:Header/wsrm:SequenceAcknowledgement/wsrm:Identifier',namespace)[0].text();
    
}

/**
 * get text of the elemnt located in xpath (//soapenv:Header/wsrm:SequenceAcknowledgement/wsrm:Identifier)
 * @param preDom dom object from which the text is extract this is option if
 * parse function was called before.
 */
exports.getTerminateSeqIdentifier = function(preDom){
  if(undefined == preDom)
    return dom.find('//soapenv:Body/wsrm:TerminateSequence/wsrm:Identifier',namespace)[0].text();
  else 
    return preDom.find('//soapenv:Body/wsrm:TerminateSequence/wsrm:Identifier',namespace)[0].text();
    
}
