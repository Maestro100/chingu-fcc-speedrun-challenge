// import modules
var express = require('express');
var request = require('request');

// get api key
require('dotenv').config();
var apikey = process.env.WEATHER_ID;

// define port
var port = 3000;

// create our app
var app = express();

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
        request("http://api.openweathermap.org/data/2.5/weather?lat=" + body.latitude + "&lon=" + body.longitude + "&APPID=" + apikey, function(error, response, body) {
          if (error) {
            console.log(error);
            res.send("Couldn't get the weather...maybe try looking out a window?");
          }
          else {
            body = JSON.parse(body);
            if (body.cod != 200) {
              console.log(body.cod + ": " + body.message);
            }
            else {
              res.send("Here's the weather: " + JSON.stringify(body));
            }
          }
        });
      }
    }
  });
});
