
// searches redirects for short-form url
var findShortForm = function(url, db) {
  var redirects = db.collection('url-redirects');
  return redirects.findOne({original_url: url});
};

// searches redirects for original url
var findOriginal = function(num, db) {
  var redirects = db.collection('url-redirects');
  return redirects.findOne({short_url: num});
};

// adds new entry to redirects
var newEntry = function(original_url, db) {
  var redirects = db.collection('url-redirects');

  // get value of new short url
  return getNextShort(db)
  .then(
    function fulfilled(val) {
      console.log("value it insert: " + val);
      var insertion = redirects.insertOne({
        'original_url': original_url,
        'short_url': val
      });
      return Promise.all([val, insertion]);
    }
  )
  .then(
    function fulfilled(data) {
      return data[0];
    },
    function rejected(reason) {
      console.log("data insertion rejected: " + reason);
      return reason;
    }
  );
};

var getNextShort = function(db) {
  var counters = db.collection('counters');
  return counters.findAndModify(
    {_id: 'short_url'}, // query
    [], // sort
    { $inc: { seq: 1} }, // update
    {new: true} // return updated ("new") version
  )
  .then(
    function fulfilled(data) {
      return data.value.seq;
    }
  );
};

// functions for clearing and resetting database
var clear = function(db) {
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

// export stuff
module.exports.findOriginal = findOriginal;
module.exports.newEntry = newEntry;
module.exports.findShortForm = findShortForm;
module.exports.setup = setup;
module.exports.clear = clear;
