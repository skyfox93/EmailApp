var http=require('http');
var respA=[];
http.get(process.argv[2],function callback(response){
response.setEncoding('utf8');
var rstring1='';
response.on("data",function(chunk){rstring1+=chunk;})
response.on('end',function(){respA[0]=rstring1; if(respA[0]&&respA[1]&&respA[2])
{console.log(respA[0]+'\n'+respA[1]+'\n'+respA[2]);}})});

http.get(process.argv[3],function callback(response){
response.setEncoding('utf8');
var rstring2='';
response.on("data",function(chunk){rstring2+=chunk;})
response.on('end',function(){respA[1]=rstring2; if(respA[0]&&respA[1]&&respA[2])
{console.log(respA[0]+'\n'+respA[1]+'\n'+respA[2]);}})});

http.get(process.argv[4],function callback(response){
response.setEncoding('utf8');
var rstring3='';
response.on("data",function(chunk){rstring3+=chunk;})
response.on('end',function(){respA[2]=rstring3;if(respA[0]&&respA[1]&&respA[2])
{console.log(respA[0]+"\n"+respA[1]+"\n"+respA[2]);}})});
