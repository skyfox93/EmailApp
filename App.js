//Declare Variables
var fs=require('fs');
var http=require('http');
var path=require('path');
const express=require('express');
//var mimelib=require('mime-lib');
var sendApp=require('./index.js');
var nodemailer=require('nodemailer');

// Load Google Credentials
try{ var credentials=require('./credentials.json')
var token=require('./token.json')} catch(error){ ' no user credentials stored. That is okay!';}
///


const { parse } = require('querystring');
var pageNum=0;
const readline = require('readline');
const {google} = require('googleapis');
const SCOPES = ['https://mail.google.com/'];
const TOKEN_PATH = 'token.json';
var emails=0;
var labelslist=[];
let parsedlist=[];

fs.watch(path.resolve('./index.js'),reload);
function reload(){delete require.cache[require.resolve('./index.js')];
sendApp=require('./index.js');console.log('updated');}
const simpleParser = require('mailparser').simpleParser;


//set up nodemailer for outgoing messages
let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        type: 'OAuth2',
        user: 'skylar.salerno@gmail.com',
        clientId:credentials.installed.client_id,
        clientSecret:credentials.installed.client_secret,
        refreshToken:token.refresh_token,
        accessToken: token.access_token,
        expires:token.expiry_date
    }
});

/// If you want to import mail from a folder instead of using Gmail (originally the only options)
/*
let filelist=[];
let Mailfolder="/Users/SkylarSalerno/Library/Mail/V5/51AC7079-35C3-4E0E-B326-32826F550B60/[Gmail].mbox/All Mail.mbox";
//let Mailfolder="./test_emails";

// Program!
//openfolder(Mailfolder);
//filelist.sort(function(a,b){return parseInt(path.basename(b))-parseInt(path.basename(a))});

//console.log(filelist.length);
//prepareEmails();
console.log ('ready to start server');


/*
function openfolder(dir){if(fs.statSync(dir).isDirectory()){
var filenames=fs.readdirSync(dir);filenames.forEach(function(filename){openfolder(dir+'/'+filename);if(path.extname(filename)==".emlx"){  filelist.push(dir+'/'+filename)}})}}


function prepareEmails(){for(let i=emails;i<emails+25;i++){if(filelist[emails+i]){parseEmail(filelist[emails+i]);}} emails+=25;}

function parseEmail(file){content=fs.readFileSync(file,'utf-8'); simpleParser(content, (err, parsed) => {parsedlist.push(parsed)})};
*/


// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Gmail API.
  authorize(JSON.parse(content), listMessages);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback,query) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}


function listMessages(auth,query) {
  const gmail = google.gmail({version: 'v1', auth});
if(query){console.log('QUERY'+query);
gmail.users.messages.list({
    userId: 'me', q:query
  },messagelister);}

else{
gmail.users.messages.list({
    userId: 'me'},messagelister);}

function messagelister (err, res){parsedlist=[];
    if (err) return console.log('The API returned an error: ' + err);
    const labels = res.data.messages;
    if (labels) {
      labels.forEach((label) => {
gmail.users.messages.get({userId: 'me', id:label.id, format:"raw"},(er, result) => {if(err){console.log('ohnoes');} else{let buffed = new Buffer(result.data.raw,'base64'); simpleParser(buffed.toString(), (err,parsed) => {if (parsed){parsedlist.unshift(parsed)}});}})})}}


};





/////////////////// SERVER LOGIC /////////////////////////////////////////////////////////////////////////
var server = http.createServer(function(request, response){
var emailNum=parseInt(request.url.slice(1)); console.log('URL IS' + request.url)
if(request.url==="/"){pageNum=0;}
if(request.url==="/next?"){pageNum+=1;}
if(request.url==="/back?"){pageNum+=1;}
	
if(request.url==="/"||request.url==="/next?"){
response.statusCode = 200;response.writeHead(200, {"Content-Type": "text/html"});
parsedlist.sort(function(a,b){return b.date- a.date});

sendApp(response,parsedlist,pageNum);
response.end('</body></html>');
//prepareEmails();
}
if(request.url==='/query?'){let query=[];let rawbody=[];request.on('data', chunk =>{rawbody+=chunk});request.on('end',()=>{query=rawbody;console.log(query);
sendApp(response,parsedlist,pageNum);
})}
else{if(isNaN(emailNum)){response.end();return} response.statusCode = 200;response.writeHead(200, {"Content-Type": "text/html"});console.log(parsedlist.length);
response.write(String(parsedlist[emailNum].html)+'</div></body></html>');response.end();


}});
server.listen(3000);
