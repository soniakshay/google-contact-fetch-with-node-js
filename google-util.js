const {google} = require('googleapis');
var express=require('express');
var url = require('url');
var contacts = google.people('v1');
var localStorage = require('localStorage');
var ls = require('local-storage');
var app=express();


const googleConfig = {
    clientId: '1086091090723-9lt5ogj7gqh6tqu85v6o7vnif2pvq1t7.apps.googleusercontent.com',
    clientSecret: '5hsm7F0gnvEWFZ5u8gq_moGB', // e.g. _ASDFA%DFASDFASDFASD#FAD-
    redirect: 'http://localhost:3000/red' // this must match your google api settings
  };
  const oauth2Client = new google.auth.OAuth2(
    '1086091090723-9lt5ogj7gqh6tqu85v6o7vnif2pvq1t7.apps.googleusercontent.com',
    '5hsm7F0gnvEWFZ5u8gq_moGB',
    'http://localhost:3000/red'
  );
  function createConnection() {
    return new google.auth.OAuth2(
      googleConfig.clientId,
      googleConfig.clientSecret,
      googleConfig.redirect
    );
  }
  const defaultScope = [
    'https://www.googleapis.com/auth/plus.me',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/contacts.readonly'
  ];

  function getConnectionUrl(auth) {
    return auth.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent', // access type and approval prompt will force a new refresh token to be made each time signs in
      scope: defaultScope
    });
  }


function urlGoogle() {
    const auth = createConnection(); // this is from previous step
    const url = getConnectionUrl(auth);
    return url;
  }


  app.get('/',function(red,res){
    res.redirect(urlGoogle());
});

app.get('/red',async function(red,response){
  var q = url.parse(red.url, true);
  const {tokens} = await oauth2Client.getToken(q.query.code);
  oauth2Client.setCredentials(tokens);

  
  const peopleService = google.people({
     version: 'v1', 
     auth: oauth2Client
  });


  peopleService.people.connections.list({
        resourceName: 'people/me',
        personFields: 'names,emailAddresses'
        },(err, res) => {
          if(err){
            console.log(err);
          }else{
            response.send(JSON.stringify(res.data.connections));
          }
  });
      
});

app.listen(3000);

module.exports=app;