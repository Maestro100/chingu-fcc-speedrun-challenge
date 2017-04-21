
// create an express app
var express = require('express');
var path = require('path');

var app = express();

// handle GET requests to '/'
app.get('/', function(req, res) {

  // try to send the index.html file
  res.sendFile(path.join(__dirname, "index.html"), function(err) {
    if (err) {
      console.log(err);
      res.send("Sorry, something's broken.");
    }
  });
});

// handle GET request for timestamp
app.get('/:date', function(req, res) {

  // create "default" response
  var response = {"unix": null, "natural": null};

  // get and format data from request
  var datestr = decodeURIComponent(req.params.date);
  datestr = datestr * 1000 || datestr;

  // get date and update response
  var date = new Date(datestr);
  if (date.getTime()) {
    response.unix = Math.floor(date.getTime() / 1000);
    response.natural = formatDate(date);
  }

  // send back response
  console.log(JSON.stringify(response));
  res.send(JSON.stringify(response));

  // helper function to format date
  function formatDate(date) {
    var months = ["January", "February", "March", "April", "May", "June", "July",
                  "August", "September", "October", "November", "December"];
    return months[date.getUTCMonth()] + " " + date.getUTCDate() + ", " + date.getUTCFullYear();
  }
});

// start listening (right now on port 3000)
app.listen(3000, function() {
  console.log('Timestamp microservice app listening on port 3000!');
});
