var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
var credentials;
var test=5;
var oauth2Client;

var credentials;
try {
	credentials = require('./client_secret.json');
}
catch (e) {
	console.log('file not found');
}
//console.log(credentials);
var clientSecret = process.env.CLIENT_SECRET || credentials.installed.client_secret;
var clientId = process.env.CLIENT_ID || credentials.installed.client_id;
var redirectUrl = process.env.REDIRECT_URI || credentials.installed.redirect_uris[0];
var cloudToken = {
	access_token: process.env.ACCESS_TOKEN,
	token_type: "Bearer",
	refresh_token: process.env.REFRESH_TOKEN,
	expiry_date: process.env.EXPIRY_DATE
};
var auth = new googleAuth();
oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);
//console.log("oauth2Client: "+oauth2Client); //third

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/drive-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'drive-nodejs-quickstart.json';

console.log(cloudToken);
if (cloudToken.access_token != undefined) {
	oauth2Client.credentials = cloudToken;
	console.log('added cloud token: '+cloudToken);
}

else if (cloudToken.access_token == undefined) {
	//console.log(oauth2Client);
	var token = fs.readFileSync(TOKEN_PATH);
	oauth2Client.credentials = JSON.parse(token);
	console.log('added token: '+token);
}
else {
	getNewToken(oauth2Client);
  console.log('got new token'); //second
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', function(code) {
    rl.close();
    oauth2Client.getToken(code, function(err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
    });
  });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  console.log('Token stored to ' + TOKEN_PATH);
}

//drive auth
var drive = google.drive({ version: 'v2', auth: oauth2Client });

/**
 * Lists the names and IDs of up to 10 files.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listFiles(res) {

  drive.files.list({
    q: "'0B4ZEBluRJ7VuYjBfYW9KOGI5aXM' in parents and mimeType='application/vnd.google-apps.folder'"
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    var folders = response.items;

    if (folders.length == 0) {
      console.log('No files found.');
    }

    else {
	    var randFolderIndex = Math.floor(Math.random()*folders.length);
	    console.log("num folders: "+folders.length);
	    console.log("rand folder: "+randFolderIndex);
	    //console.log(folders[randFolderIndex].id);
	    var randFolderId = folders[randFolderIndex].id;
	    var randFolderTitle = folders[randFolderIndex].title;
	    var query = "'"+randFolderId+"' in parents and (mimeType='image/jpeg' or mimeType='image/png' or mimeType='image/gif')";
	    console.log(query);
	    //console.log(randFolder);
	    drive.files.list({
	    	q: query
	    }, function(err, response) {
	    	if (err) {
	    		console.log(err);
	    		return;
	    	}

	    	var files = response.items;

	    	if (files.length == 0) {
	    		console.log('No files found.');
	    		return;
	    	}
	    	var randFileIndex = Math.floor(Math.random()*files.length);
	    	var randFile = files[randFileIndex];
	    	var publicLink = "https://drive.google.com/uc?export=view&id="+randFile.id;
	    	var response = {
	    		publicLink: publicLink,
	    		title: randFolderTitle
	    	};
	    	console.log("response: "+JSON.stringify(response));
	    	res.send(JSON.stringify(response));
	    });
    }
  });
}

function getFile(id, res) {
  //var query = "'"+id+"' in id and (mimeType='image/jpeg' or mimeType='image/png' or mimeType='image/gif')";
  console.log("id: "+id);
  drive.files.get({
    'fileId': id
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }

    res.send(JSON.stringify(response));
  })
}

var express = require('express');
var app = express();
app.set('port', (process.env.PORT || 3000));
// view engine setup
app.set('views', 'views');
app.set('view engine', 'jade');

app.use('/static', express.static(__dirname + '/public'));
/// catch 404 and forward to error handler

app.get('/', function (req, res) {
    res.render('index');
});

app.get('/api/newImg', function (req, res) {
	console.log("hit getnewImg");
	listFiles(res);
	console.log("sent res");
});

app.get('/api/getImg/:id', function(req, res) {
  console.log("hit id");
  console.log(req.params);
  getFile(req.params.id, res);
  console.log('sent file');
})

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});