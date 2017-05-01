var assert = require('assert');

var findShortForm = function(url, db, callback) {
  var collection = db.collection('url-redirects');

  collection.findOne({'original_url': url}, function(err, result) {
    assert.equal(err, null);
    if (result) {
      console.log("Found the following record");
      console.log(result);
    }
    else {
      console.log("No result found");
    }
    callback(result);
  });
};

var addShortForm = function(original_url, short_url, db, callback) {
  var collection = db.collection('url-redirects');

  collection.insertOne({'original_url': original_url, 'short_url': short_url}, function(err, result) {
    assert.equal(err, null);
    assert.equal(result.result.n, 1);
    console.log("new short form added");
    callback(result);
  });
};

var findOriginal = function(short, db, callback) {
  var collection = db.collection('url-redirects');

  collection.findOne({"short_url": short}, function(err, result) {
    assert.equal(err, null);
    if (result) {
      console.log("Found the following record");
      console.log(result);
    }
    else {
      console.log("No result found");
    }
    callback(result);
  });
};

module.exports.findOriginal = findOriginal;
module.exports.addShortForm = addShortForm;
module.exports.findShortForm = findShortForm;
