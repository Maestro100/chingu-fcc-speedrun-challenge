
// create an express app
var express = require('express');
var app = express();

// handle GET requests to '/'
app.get('/', function(req, res) {

  // try to send the index.html file
  res.sendFile(__dirname + '/index.html', function(err) {
    if (err) {
      console.log(err);
      res.send("Sorry, something's broken.");
    }
    else {
      console.log('sent');
    }
  });
});

// handle GET request for timestamp
app.get('/:date', function(req, res) {

  // grab parameter passed by user
  var datestr = decodeURIComponent(req.params.date);
  datestr = datestr * 1000 || datestr;

  // create a date object
  var date = new Date(datestr);

  // check that date is valid and send back response
  if (!date.getTime()) {
    res.send({"unix": null, "natural": null});
  }
  else {
    res.send({
      "unix": Math.floor(date.getTime() / 1000),
      "natural": formatDate(date)
    });
  }

  // function to format date
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
