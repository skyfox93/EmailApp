//Required Modules
var fs=require('fs');
var http=require('http');
var path=require('path');
var mimelib=require('mime-lib');
var sendApp=require('./index.js');
console.log(require.cache[require.resolve('./index.js')])

fs.watch(path.resolve('./index.js'),reload)
function reload(){delete require.cache[require.resolve('./index.js')];sendApp=require('./index.js');}



console.log(require.cache[require.resolve('./index.js')]);
//Global Variables
let parsed=[];
let filelist=[];
//let Mailfolder="/Users/SkylarSalerno/Library/Mail/V5/51AC7079-35C3-4E0E-B326-32826F550B60/[Gmail].mbox/All Mail.mbox";
let Mailfolder="./test_emails";

// Program!
openfolder(Mailfolder);
filelist.sort(function(a,b){return parseInt(path.basename(b))-parseInt(path.basename(a))});
var emails=0;
//console.log(filelist);
prepareEmails();
console.log ('ready to start server');


function openfolder(dir){if(fs.statSync(dir).isDirectory()){
var filenames=fs.readdirSync(dir);filenames.forEach(function(filename){openfolder(dir+'/'+filename);if(path.extname(filename)==".emlx"){  filelist.push(dir+'/'+filename)}})}}


function prepareEmails(){for(let i=0;i<25;i++){let Email=parseEmail(filelist[emails+i]);} emails+=25;}

function parseEmail(file){content=fs.readFileSync(file,'utf-8');
if(content.includes("base64")||content.includes('BASE64')){let bound=(content.indexOf('base64')|| content.indexOf("BASE64"));
var buf=Buffer.from(content,'base64');
var text=buf.toString('utf8');
	var text= 'Unable to Display; feature in development';


console.log('CONVERTED'+ text);}else {var text=mimelib.decodeQP(content);}

						  			if(text.includes("<html")){var begin=text.indexOf("<html");var end= text.indexOf('</html>')+7;}
								   else {var begin=text.indexOf("<div");var end=text.lastIndexOf("</div>")+6;}


								   var message=text.slice(begin,end).replace(/&quote/g,'"')||text

parsed.push(message);}




var server = http.createServer(function(request, response){

 var pagenum=parseInt(request.url.slice(1));if(request.url==="/"){
console.log(pagenum);response.statusCode = 200;response.writeHead(200, {"Content-Type": "text/html"});
sendApp(response);

response.end('</body></html>');} else{response.statusCode = 200;response.writeHead(200, {"Content-Type": "text/html"});
response.write(String(parsed[pagenum])+'</div></body></html>');response.end();


}})
server.listen(3000);
