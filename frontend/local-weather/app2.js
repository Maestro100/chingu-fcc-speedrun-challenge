// import modules
var express = require('express');
var request = require('request');
var path = require('path');

var weather = require('./weather.js');
var locate = require('./location.js');

// get api key
require('dotenv').config();
var apikey = process.env.WEATHER_ID;

// define port
var port = 3000;

// create our app
var app = express();

// set view engine
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// start server
app.listen(port, function() {
  console.log("Weather app listening on port " + port + "!");
});

// handle get requests to homepage
app.get('/', function(req, res) {

  // make get request for user's location
  locate.getLocationFromIP(req.ip)
  .then(
    function fulfilled(location) {
      return weather.requestData(location, apikey);
    }
  )
  .then(
    function fulfilled(data) {
      return weather.processData(data);
    }
  )
  .then(
    function fulfilled(data) {
      res.render('homepage', data);
    },
    function rejected(reason) {
      console.log(reason);
      res.send(reason);
    }
  );
});

app.get('/assets/:which', function(req, res) {
  res.sendFile(path.join(__dirname, 'assets', req.params.which));
});
