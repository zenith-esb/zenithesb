var Agent = require('agentkeepalive');
var url = require('url');
var http = require("http");
var net = require('net');

var Endpoint = function(serviceUrl){
  
  this.url = serviceUrl;
  var parsedUrl = url.parse(this.url);
  
  var keepaliveAgent = new Agent({
    maxSockets: 4,
    maxFreeSockets:4,
    keepAlive: true,
    keepAliveMsecs: 30000, // keepalive for 30 seconds
  });
  
  this.options = {
      host: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.path,
      method:'POST',
      agent:keepaliveAgent,
      headers:{
               'content-type':'text/xml',
               'transfer-encoding': 'chunked',
               'Connection':'keep-alive'
               }
      };
}


Endpoint.prototype.callService = function (reqBody,callback) { 
 
   var post_req = http.request(this.options, function(res) {
                      var resBody='';
                       res.setEncoding('utf8');
                       res.on('data', function (chunk) {
                         resBody = resBody+chunk; ;
                       });
                       
                       res.on('end', function (chunk) {
                         callback({'body':resBody,'statusCode':res.statusCode,});
                         
                        
                       }); 
                 });
      
         post_req.on('error', function(e) {
           console.log(e);  
          });
          
         post_req.write(reqBody);
         post_req.end();
         
         post_req.on('socket', function(socket) {
         socketC = socket;
         socketC.allowHalfOPen=true;
         socket.on('close',function(data){
          // console.log('close');
         });
         
        });
       

}  

/*var socket;
function callService(reqBody, option, callback) { 
 var parseURL = url.parse(option.url);   
 var resBody='';
 //if(!socket){
   socket = new net.Socket();  
   socket.setKeepAlive(true);
   socket.allowHalfOpen=true;
   socket.connect(parseURL.port,parseURL.hostname);
   socket.setEncoding('UTF-8');
   socket.on('close',function(){console.log('close');});
   socket.on('connect',function(){console.log('connected')});
   var data="POST /services/ReliableStockQuoteService HTTP/1.1\r\n"+
             "Content-Type: text/xml\r\n"+
             "Connectiont: keep-alive\r\n"+
             "Transfer-Encoding: Chunked\r\n"+
             "\r\n"+reqBody.length+"\r\n"+reqBody+"0\r\n\r\n";
   socket.write(data);     
   socket.on('data',function(data){
       parser.parse1(data,callback);
   })
   socket.on('end',function(){
      console.log('end');
   });
   socket.on('close',function(){
     console.log('close');
   });
   socket.on('error',function(err){console.log(err)});

} */

module.exports = Endpoint; 