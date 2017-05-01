
// require modules
var re_url = require('./regex-weburl.js');
var redirects = require('./db-functions-3.js');
var url = require('url');

// ...express app
var express = require('express');
var app = express();

// ...database
var mongoClient = require('mongodb').MongoClient;
var db_url = 'mongodb://localhost:27017/api_url_shortener';

// make sure that database is set up correctly
mongoClient.connect(db_url)
  // empty database collections
  .then(
    function fulfilled(db) {
      return redirects.clear(db);
    }
  )
  // set up counter
  .then(
    function fulfilled(data) {
      var db = data[0];
      return redirects.setup(db);
    }
  )
  // tidy up
  .then(
    function fulfilled(data) {
      var db = data[0];
      db.close();
      console.log("Good to go!");
    },
    function rejected(reason) {
      console.log("Drat. " + reason);
    }
  );

// handle GET requests to '/'
app.get('/', function(req, res) {
  res.send("Instructions page");
});

// handle GET requests for new url
app.get('/new/*', function(req, res) {

  // get url from path & validate
  var url = req.path.slice(5);
  if (re_url.validate(url)) {

    // connect to database server
    mongoClient.connect(db_url, function(err, db) {
      console.log(err ? err : "connected successfully");

      // try to find short-form url in database
      redirects.findShortForm(url, db)

      // if not found, create a new one
      .then(
        function fulfilled(result) {
          return result ? result.short_url : redirects.newEntry(url, db);
        }
      )

      // return the short form to user
      .then(
        function fulfilled(result) {
          res.json({
            "original_url": url,
            "short_url": result
          });
          db.close();
        },
        function rejected(reason) {
          console.log(reason);
          res.json({
            "error": "problem creating short url"
          });
          db.close();
        }
      );
    });
  }
  else {
    res.json({
      "error": "url not valid"
    });
  }
});

// handle all other GET requests
app.get('/*', function(req, res) {

  // redirect obviously bad urls straight to home page
  if (!/^\/[0-9]+$/.test(req.path)) {
    res.redirect("/");
  }

  // now we handle the "good" ones
  else {

    // connect to database server
    mongoClient.connect(db_url, function(err, db) {
      if (err) {
        console.log(err);
      }
      else {
        console.log("connected successfully to server");

        // try to find the original url
        redirects.findOriginal(+req.path.slice(1), db)

        // if successful, redirect user
        .then(
          function fulfilled(result) {
            if (result) {
              res.redirect(result.original_url);
            }
            else {
              res.redirect('/');
            }
            db.close();
          },
          function rejected(reason) {
            console.log(reason);
            res.redirect('/');
            db.close();
          }
        );
      }
    });
  }
});

// start listening!
app.listen(3000, function() {
  console.log("listening!!!");
});
