// import modules
var express = require('express');
var request = require('request');
var path = require('path');

var weather = require('./weather.js');

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
  request("https://freegeoip.net/json/" + req.ip, function(error, response, body) {
    if (error) {
      console.log(error);
      res.send("Oops! Couldn't get your location!");
    }
    else {
      body = JSON.parse(body);
      if (!body.longitude || !body.latitude) {
        console.log("I'm missing longitude and/or latitude");
        res.send("I don't know where you are!");
      }
      else {
        console.log(body.latitude, body.longitude);
        var loc = {
          lat: body.latitude,
          lon: body.longitude
        };
        weather.requestData(loc, apikey)
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
      }
    }
  });
});

  app.get('/assets/:which', function(req, res) {
    res.sendFile(path.join(__dirname, 'assets', req.params.which));
  });
