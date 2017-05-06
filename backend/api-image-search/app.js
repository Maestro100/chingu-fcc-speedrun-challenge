// require modules and create variables
var express = require('express');
var request = require('request');
var mongoClient = require('mongodb').MongoClient;

// grab environmental variables
require('dotenv').config();
var apiKey = process.env.API_KEY;
var engineURL = process.env.ENGINE_URL;
var engineID = process.env.ENGINE_ID;

// get app up and running
var app = express();
app.listen(3000, function() {
  console.log("App is listening.");
});

// handle GET requests to homepage
app.get('/*', function(req, res) {
  var params = getParams(req.url);
  console.log(params);
  if (!params.search) {
    console.log('no search query provided');
    res.json({'error': 'no search parameter found'});
  }
  else {
    getSearchResults(getParams(req.url))
    .then(
      function fulfilled(results) {
        console.log(results);
        results = formatSearchResults(results);
        console.log(results);
        res.json(results);
      },
      function rejected(reason) {
        console.log(reason);
        res.json({'error': reason});
      }
    );
  }

  function formatSearchResults(results) {
    var items = JSON.parse(results).items;
    return items.map(function(item) {
      return {
        url: item.link,
        snippet: item.snippet,
        thumbnail: item.image.thumbnailLink,
        context: item.image.contextLink
      };
    });
  }

  function getSearchResults(params) {
    var url = 'https://www.googleapis.com/customsearch/v1?';
    return new Promise(function(resolve, reject) {
      request(url +
        'q=' + params.search.replace(/%20/g, '+') +
        '&cref=' + engineURL +
        '&cx=' + engineID +
        '&filter=1' +
        '&num=10' +
        '&safe=medium' +
        '&searchType=image' +
        '&start=' + (Math.abs(params.offset) * 10 || 1) +
        '&fields=items(image(contextLink%2CthumbnailLink)%2Clink%2Csnippet)' +
        '&key=' + apiKey,
        function(error, response, body) {
          if (error) {
            reject('search failed');
          }
          else if (response && response.statusCode !=200){
            console.log(body);
            reject('unsuccessful search');
          }
          else {
            resolve(body);
          }
        }
      );
    });
  }

  function getParams(url) {
    var params = {};
    req.url.slice(1).split('?').forEach(function(x) {
      var [key, value] = x.split('=');
      if (!params[key]) {
        params[key] = value;
      }
    });
    return params;
  }
});
