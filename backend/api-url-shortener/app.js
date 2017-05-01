// temporary global variable
var ticker = 0;

// require modules
var path = require('path');

var re_url = require('./regex-weburl.js');
var redirects = require('./db-functions-promise.js');

// ...express app
var express = require('express');
var app = express();

// ...database
var mongoClient = require('mongodb').MongoClient;
var db_url = 'mongodb://localhost:27017/api_url_shortener';

// make sure that database is set up correctly
mongoClient.connect(db_url, function(err, db) {
  if (err) {
    console.log(err);
  }
  else {
    redirects.setup(db);
  }
});

// handle GET requests to '/'
app.get('/', function(req, res) {
  res.send("Instructions page");
});

// handle GET requests for new url
app.get('/new/*', function(req, res) {

  // validate url & create data object
  var url = req.path.slice(5);
  var data = {};

  // check that url is valid
  if (re_url.validate(url)) {

    // assign new url
    data.original_url = original_url;

    // connect to database server
    mongoClient.connect(db_url, function(err, db) {
      assert.equal(null, err);
      console.log("Connected successfully to server");

      // check whether redirect already exists
      redirects.findShortForm(original_url, db, function(result) {
        if (result) {
          data.short_url = result.short_url;
          db.close();
          // send data
          res.json(data);
        }
        else {
          var short = "/" + ticker.toString();
          ticker++;

          redirects.addShortForm(original_url, short, db, function() {
            data.short_url = short;
            db.close();
            // send data
            res.json(data);
          });
        }
      });
    });
  }
  else {
    data.error = "url not valid";
    // send data
    res.json(data);
  }


});

// handle all other GET requests
app.get('/*', function(req, res) {

  // create variables
  var url = "/";

  console.log(/^\/[0-9a-z]+$/.test(req.path));
  // try to find redirect url
  if (/^\/[0-9a-z]+$/.test(req.path)) {
    // for right now:
    console.log("you are here");
    mongoClient.connect(db_url, function(err, db) {
      assert.equal(null, err);
      console.log("connected successfully to server");

      redirects.findOriginal(req.path, db, function(result) {
        if (result) {
          res.redirect(result.original_url);
          db.close();
        }
        else {
          res.redirect("/");
          db.close();
        }
      });
    });
  }
  else {
    // redirect user
    res.redirect(url);
  }
});

app.listen(3000, function() {
  console.log("listening!!!");
});
