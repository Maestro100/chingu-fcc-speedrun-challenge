// require modules and create variables
var express = require('express');
var request = require('request');
var mongoClient = require('mongodb').MongoClient;
var dbURL = 'mongodb://localhost:27017/image_search';

// grab environmental variables
require('dotenv').config();
var apiKey = process.env.API_KEY;
var engineURL = process.env.ENGINE_URL;
var engineID = process.env.ENGINE_ID;

// get app up and running
var app = express();
app.listen(3000, function() {

  // reset database - how do I not have to do this?
  mongoClient.connect(dbURL)
  .then(
    function fulfilled(db) {
      return Promise.all([db, db.collection('latest').remove({})]);
    }
  )
  .then(
    function fulfilled([db, result]) {
      return Promise.all([db, db.collection('latest').insert({
        latest: []
      })]);
    }
  )
  .then(
    function fulfilled([db, result]) {
      console.log("App is listening.");
      db.close();
    },
    function rejected(reason) {
      console.log(reason);
    }
  );
});

// handle GET requests for history
app.get('/latest', function(req, res) {
  mongoClient.connect(dbURL)
  .then(
    function fulfilled(db) {
      var collection = db.collection('latest');
      return Promise.all([collection.findOne(), db]);
    }
  )
  .then(
    function fulfilled([doc, db]) {
      res.json(doc.latest);
      db.close();
    }
  )
  .then(
    function fulfilled() {
      console.log('success');
    },
    function rejected(reason) {
      console.log("rejected: " + reason);
      res.json({"error": "request failed"});
    }
  );
});

// handle GET requests to homepage
app.get('/*', function(req, res) {
  var params = getParams(req.url);
  if (!params.search) {
    console.log('no search query provided');
    res.json({'error': 'no search parameter found'});
  }
  else {
    getSearchResults(params)
    .then(
      function fulfilled(results) {
        results = formatSearchResults(results);
        return results;
      }
    )
    .then(
      function fulfilled(results) {
        return Promise.all([results, updateLatest(params.search, dbURL)]);
      }
    )
    .then(
      function fulfilled(arr) {
        res.json(arr[0]);
        console.log("success: database updated");
      },
      function rejected(reason) {
        console.log('err ' + reason);
        res.json({"error": reason});
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
  /* Used for testing - so I'm not making as many api calls

  function getFakeSearchResults(params) {
    return {items:[{"url":"http://content.13newsnow.com/photo/2016/04/21/-1x-1_1461249886262_1819968_ver1.0.jpg","snippet":"Pumpkin Spice Cheerios in the works | MYFOXZONE.COM","thumbnail":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxMWPTDZS4kUcAYbvL8wmweLOQTRPOnpnpWsoyduaLRADHBKLdOU_KegY","context":"http://www.myfoxzone.com/life/pumpkin-spice-cheerios-in-the-works/288442089"},{"url":"https://media1.popsugar-assets.com/files/thumbor/7qJUgAcYBspN-5vW02LLoBnvfIA/fit-in/2048xorig/filters:format_auto-!!-:strip_icc-!!-/2017/01/12/830/n/1922195/56dee7de244532e0_cheerios5.jpg","snippet":"Very Berry Cheerios Review | POPSUGAR Food","thumbnail":"https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQGSn3ZLWaLMSZYSWMRbjzemJCdk81LYC99DGOa3-e4_GYGLpL_SjiUctk","context":"https://www.popsugar.com/food/Very-Berry-Cheerios-Review-42990596"}]};
  }
  */
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

  function updateLatest(search, dbURL) {
    mongoClient.connect(dbURL)
    .then(
      function fulfilled(db) {
        var collection = db.collection('latest');
        return Promise.all([collection.findOne(), db]);
      }
    )
    .then(
      function fulfilled([doc, db]) {
        if (doc.latest.length == 10) {
          doc.latest.pop();
        }
        doc.latest.unshift({
          search: search,
          time: new Date().toISOString()
        });
        return [doc, db];
      }
    )
    .then(
      function fulfilled([doc, db]) {
        var collection = db.collection('latest');
        return [collection.updateOne({}, { $set:{latest:doc.latest} }), db];
      }
    )
    .then(
      function fulfilled([update, db]) {
        db.close();
      },
      function rejected(reason) {
        console.log(reason);
        return reason;
      }
    );
  }
});
