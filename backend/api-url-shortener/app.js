// require modules
var path = require('path');
var re_url = require('./regex-weburl.js');

// ...express app
var express = require('express');
var app = express();

// ...database
//var mongoClient = require('mongodb').MongoClient;
//var db_url = 'mongodb://localhost:27017/api_url';

// handle GET requests to '/'
app.get('/', function(req, res) {
  res.send("Instructions page");
});

// handle GET requests for new url
app.get('/new/*', function(req, res) {

  // validate url
  var url = req.path.slice(5);
  if (re_url.validate(url)) {

    // get and send redirect
    res.send("When this works, you'll get a short url to " + url);
  }
  else {

    // send error message
    res.send("This will eventually be a JSON error message");
  }
});

// handle all other GET requests
app.get('/*', function(req, res) {
  var url = "/";

  // try to find redirect url
  if (/^\/[0-9a-z]+$/.match(req.path)) {
  }

  // redirect user
  res.redirect(url);
});

app.listen(3000, function() {
  console.log("listening!!!");
});
