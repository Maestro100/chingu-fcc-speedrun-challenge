
// searches redirects for short-form url
var findShortForm = function(url, db) {
  var redirects = db.collection('url-redirects');
  return redirects.findOne({'original_url': url});
};

/*
// searches redirects for original url
var findOriginal = function(url, db) {
  return new Promise(function(resolve, reject) {
    var redirects = db.collection('url-redirects');
    redirects.findOne({'short_url': url}, function(err, result) {
      if (err) {
        reject(err);
      }
      else {
        resolve(result);
      }
    });
  });
};

// adds new entry to redirects
var newEntry = function(original_url, db) {
  return new Promise(function(resolve, reject) {
    var redirects = db.collection("url-redirects");
    getNextShort(db)
      .then(
        function fulfilled(newShort) {
          redirects.insertOne({'original_url': original_url, 'short_url': newShort}, function(err, result) {
            if (err) {
              reject(err);
            }
            else {
              resolve(newShort);
            }
          });
        },
        function rejected(reason) {
          console.log(reason);
          reject(reason);
        }
      );
  });
};

var getNextShort = function(db) {
  return new Promise(function(resolve, reject) {
    var counters = db.collection("counters");
    counters.findAndModify(
      {_id: "short_url"},
      { $inc: { seq: 1 } },
      {new: true},
      function(err, record) {
        if (err) {
          console.log("error in getnextshort");
          reject(err);
        }
        else {
          console.log("result.value:", record.value);
          resolve(record.value.seq);
        }
    });
  });
};

*/
// functions for clearing and resetting database
var emptyDB = function(db) {
  var counters_clear = db.collection("counters").remove({});
  var redirects_clear = db.collection("url-redirects").remove({});
  return Promise.all([db, counters_clear, redirects_clear]);
};

var setup = function(db) {
  var insertion = db.collection("counters").insert({
      _id: "short_url",
      seq: 0
    });
  return Promise.all([db, insertion]);
};

module.exports.findOriginal = findOriginal;
module.exports.newEntry = newEntry;
module.exports.findShortForm = findShortForm;
module.exports.setup = setup;
module.exports.clear = clear;
