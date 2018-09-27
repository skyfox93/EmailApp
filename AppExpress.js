//Declare Variables
var fs=require('fs');
var http=require('http');
var path=require('path');
const express=require('express');
const app=express();
const bodyParser=require('body-parser');
var nodemailer=require('nodemailer');

// Load Google Credentials
try{ var credentials=require('./credentials.json')
var token=require('./token.json')} catch(error){ ' no user credentials stored. That is okay!';}
const { parse } = require('querystring');
var pageNum=0;
const readline = require('readline');
const {google} = require('googleapis');
const SCOPES = ['https://mail.google.com/'];
const TOKEN_PATH = 'token.json';
var emails=0;
var labelslist=[];
let parsedlist=[];

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
app.set('view engine','pug');
app.use(bodyParser.urlencoded({extended: false}));
var pageNum=0;
app.get('/', (req,res)=>{pageNum=0;res.redirect('/home')})
app.get('/next?', (req,res) => {pageNum+=1;res.redirect('/home')});
app.get('/back?', (req,res) => {pageNum-=1;res.redirect('/home')});
app.get(/^\/email/,(req,res) =>{var emailNum=parseInt(req.url.slice(7)); console.log('URL IS' + req.url);
res.send(String(parsedlist[emailNum].html)+'</div></body></html>');})
app.get('/home',(req,res) => {res.locals.pageNum=pageNum,10;res.locals.parsedlist=parsedlist;res.render('index');});
app.listen(3000, () => console.log('Example app listening on port 3000!'))
