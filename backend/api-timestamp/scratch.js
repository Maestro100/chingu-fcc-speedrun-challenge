// __dirname is a variable provided by node
// currently, its value is this:
C:\Users\...\GitHub\chingu-fcc-speedrun-challenge\backend\api-timestamp

// request index.html using node's path module:
var path = require('path');
res.sendFile(path.join(__dirname, 'index.html'), function(err) {});

// or you can just do this:
res.sendFile(__dirname + '/index.html', function(err) {});
