var express = require('express');
var multer = require('multer');
var upload = multer({
  limits: {fileSize: 10000000}
});

var app = express();
app.listen(3000, function() {
  console.log("listening on port 3000");
});

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/' + 'index.html');
});

app.post('/upload-file', upload.single('file'), function (req, res) {
  if (req.file && req.file.size) {
    res.json({
      size: req.file.size
    });
  }
  else {
    res.json({
      error: 'error with file upload'
    });
  }
});
