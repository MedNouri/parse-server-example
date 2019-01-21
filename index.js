// Example express application adding the parse-server module to expose Parse
// compatible API routes.

var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var path = require('path');

//var databaseUri = "mongodb://localhost:27017";

// if (!databaseUri) {
//   console.log('DATABASE_URI not specified, falling back to localhost.');
// }

var api = new ParseServer({
  databaseURI: 'mongodb://heroku_ks3sh6jj:1d44pek1cdm62t1conha23f6a8@ds129904.mlab.com:29904/heroku_ks3sh6jj',
  cloud: __dirname + '/cloud/main.js',
  appId: '15RYufVckHRRd0EiRlV9',

  masterKey: 'EEjQ4Mjrqp36FGEPehEB', //Add your master key here. Keep it secret!
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
  },
  push: {
    android: {
      apiKey: 'AIzaSyDIRGhEXKP00RKrS0PiqplkmTVOlL5z3Y8'
    },
    ios: {
      pfx: '', // The filename of private key and certificate in PFX or PKCS12 format from disk  
      passphrase: '', // optional password to your p12
      cert: '', // If not using the .p12 format, the path to the certificate PEM to load from disk
      key: '', // If not using the .p12 format, the path to the private key PEM to load from disk
      bundleId: '', // The bundle identifier associated with your app
      production: false // Specifies which APNS environment to connect to: Production (if true) or Sandbox
    }
  }

  // account lockout policy setting (OPTIONAL) - defaults to undefined
  // if the account lockout policy is set and there are more than `threshold` number of failed login attempts then the `login` api call returns error code `Parse.Error.OBJECT_NOT_FOUND` with error message `Your account is locked due to multiple failed login attempts. Please try again after <duration> minute(s)`. After `duration` minutes of no login attempts, the application will allow the user to try login again.
  // accountLockout: {
  //   duration: 5, // duration policy setting determines the number of minutes that a locked-out account remains locked out before automatically becoming unlocked. Set it to a value greater than 0 and less than 100000.
  //   threshold: 3, // threshold policy setting determines the number of failed sign-in attempts that will cause a user account to be locked. Set it to an integer value greater than 0 and less than 1000.
  // }

  /* ,
  // optional settings to enforce password policies
  passwordPolicy: {
    // Two optional settings to enforce strong passwords. Either one or both can be specified. 
    // If both are specified, both checks must pass to accept the password
    // 1. a RegExp object or a regex string representing the pattern to enforce 
    validatorPattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/, // enforce password with at least 8 char with at least 1 lower case, 1 upper case and 1 digit
    // 2. a callback function to be invoked to validate the password  
    validatorCallback: (password) => { return validatePassword(password) }, 
    doNotAllowUsername: true, // optional setting to disallow username in passwords
    maxPasswordAge: 90, // optional setting in days for password expiry. Login fails if user does not reset the password within this period after signup/last reset. 
    maxPasswordHistory: 5, // optional setting to prevent reuse of previous n passwords. Maximum value that can be specified is 20. Not specifying it or specifying 0 will not enforce history.
    //optional setting to set a validity duration for password reset links (in seconds)
    resetTokenValidityDuration: 24*60*60, // expire after 24 hours
  } */
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