// Example express application adding the parse-server module to expose Parse
// compatible API routes.

var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var path = require('path');
var schedule = require('node-schedule');
//var databaseUri = "mongodb://localhost:27017";

// if (!databaseUri) {
//   console.log('DATABASE_URI not specified, falling back to localhost.');
// }

var api = new ParseServer({
  databaseURI: 'mongodb://heroku_ks3sh6jj:1d44pek1cdm62t1conha23f6a8@ds129904.mlab.com:29904/heroku_ks3sh6jj',
  cloud: __dirname + '/cloud/main.js',
  appId: '15RYufVckHRRd0EiRlV9',

  masterKey: 'EEjQ4Mjrqp36FGEPehEB', //Add your master key here. Keep it secret!

  push: {
    android: {
      apiKey: 'AAAAW-O_q5c:APA91bELMX5HIPzR9ZDcHXYo5hvPG0RtM6dQwM_Gq2EaXbKQvPN4SEeaBrc_QTU3m9PqHeNZdZOXaULGfebH_7QthnWzb35AekC7WoCJfFUjajTx1BgBkJPkANELesTEHUN2CkmyNAx2'
    }
  },
  serverURL: 'https://eventroad.herokuapp.com/parse', // Don't forget to change to https if needed

  // liveQuery: {
  //   classNames: ["Posts", "Comments"] // List of classes to support for query subscriptions
  // },push: {
  //   android: {
  //     apiKey: 'AAAAsh9sl2s:APA91bFjoSwDv8TZYyt_bKQHyDRFD3BAx7FGYm5J1DDyUQVSiD9kCdJ8s0bmOP4FbJGXvazuZ8eLuJIKVUaJcU3i-QXig-CprjSS7RZPOatm8BY8ymKXC5JclkIQ_Xkr2Shqrtx9sjOr'
  //   }},


  // Enable email verification
  verifyUserEmails: true,

  // if `verifyUserEmails` is `true` and
  //     if `emailVerifyTokenValidityDuration` is `undefined` then
  //        email verify token never expires
  //     else
  //        email verify token expires after `emailVerifyTokenValidityDuration`
  //
  // `emailVerifyTokenValidityDuration` defaults to `undefined`
  //
  // email verify token below expires in 2 hours (= 2 * 60 * 60 == 7200 seconds)

  // set preventLoginWithUnverifiedEmail to false to allow user to login without verifying their email
  // set preventLoginWithUnverifiedEmail to true to prevent user from login if their email is not verified
  preventLoginWithUnverifiedEmail: false, // defaults to false

  // The public URL of your app.
  // This will appear in the link that is used to verify email addresses and reset passwords.
  // Set the mount path as it is in serverURL
  publicServerURL: 'https://eventroad.herokuapp.com/parse',
  // Your apps name. This will appear in the subject and body of the emails that are sent.
  appName: 'Event Road',
  // The email adapter
  emailAdapter: {
    module: '@parse/simple-mailgun-adapter',
    options: {
      // The address that your emails come from
      fromAddress: 'mehdiSd@example.com',
      // Your domain from mailgun.com
      domain: 'sandbox9e9134b04bb3489dbfcd2ad1318cde51.mailgun.org',
      // Your API key from mailgun.com
      apiKey: 'af7fb646350c3486c351e26664648ab6-3939b93a-fd198105',
    }
  }


});
// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

var app = express();

// Serve static assets from the /public folder
app.use('/public', express.static(path.join(__dirname, '/public')));

// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);

// Parse Server plays nicely with the rest of your web routes
app.get('/', function (req, res) {
  res.status(200).send('I dream of being a startUp .  Please star the parse-server repo on GitHub!');
});

// There will be a test page available on the /test path of your server url
// Remove this before launching your app
app.get('/test', function (req, res) {
  res.sendFile(path.join(__dirname, '/public/test.html'));
});

var port = process.env.PORT || 1337;
var httpServer = require('http').createServer(app);
httpServer.listen(port, function () {
  console.log('parse-server-example running on port ' + port + '.');
});

// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer);

 

var startJob = schedule.scheduleJob('*/1 * * * *', async function () {
  const query = new Parse.Query("Service");
  query.equalTo("ended", false)
  const results = await query.find();
  console.log("queery")
  for (let i = 0; i < results.length; ++i) {
    var Serviceskill = results[i].get("skills");
    var createdBy = results[i].get("creator");
    console.log("for")
    lookForDemandes(Serviceskill, createdBy)

  }
});


function intersect_arrays(Skills1, Skills2) {

  var ret = [];
  Skills1.sort();
  Skills2.sort();
  for (var i = 0; i < Skills1.length; i += 1) {

    if (Skills2.indexOf(Skills1[i]) > -1) {
      console.log("found")

      ret.push(this[i]);
    }
  }
  return ret;


}


async function lookForDemandes(Serviceskill, createdBy) {


  const query = new Parse.Query("Demande");
  query.equalTo("ended", false)
   query.notEqualTo("creator",createdBy)
  const results = await query.find();
  let sum = 0;
  for (let i = 0; i < results.length; ++i) {
    console.log("run")
    // we have All the skills we are looking For 
    var Demandeskill = results[i].get("skills");
    var ConcernedUsers = results[i].get("concernedUsers");
    // now We are looking which Service have this Skills 

    if (intersect_arrays(Serviceskill, Demandeskill).length > 0) {

      ConcernedUsers.add(createdBy);
      await results[i].save()
      console.log("okkk")
      // add the Curent to the Concerned USers 


    }


  }
}
