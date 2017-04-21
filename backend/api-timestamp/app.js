
// create an express app
var express = require('express');
var app = express();

// handle GET requests to '/'
app.get('/', function(req, res) {

  // try to send the index.html file
  res.sendFile(__dirname + '/index.html', function(err) {

    // if that doesn't work, say sorry!
    if (err) {
      console.log(err);
      res.send("Sorry, something's broken.");
    }
    // if it does? Hooray!
    else {
      console.log('sent');
    }
  });
});

// start listening (right now on port 3000)
app.listen(3000, function() {
  console.log('Timestamp microservice app listening on port 3000!');
});
