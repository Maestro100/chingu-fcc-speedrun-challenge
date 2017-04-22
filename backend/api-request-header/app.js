// create express app
var express = require('express');
var app = express();

// require function to parse header
var parseHeader = require('./headerparser.js');

// handle GET requests
app.get("/", function(req, res) {
  res.send(parseHeader(req));
});

// start listening
app.listen(3000, function() {
  console.log("api header parser listening on port 3000");
});
