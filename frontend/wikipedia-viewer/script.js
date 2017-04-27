var search_field = document.getElementById('search-field');
var search_btn = document.getElementById('search-btn');
var rand_btn = document.getElementById('rand-btn');
var search_results = document.getElementById('search-results');

function search(input, success) {
  input = encodeURIComponent(input);
  var url = "https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=revisions&list=search&rvprop=ids&srsearch=" + input + "&srlimit=10&srinfo=totalhits%7Csuggestion%7Crewrittenquery";

  var req = new XMLHttpRequest();
  req.open("GET", url);
  req.setRequestHeader('Api-User-Agent', 'Example/1.0');
  req.onload = function() {
    if (req.status === 200) {
      var response = JSON.parse(req.response);
      success(response.query.search);
    }
    else {
      console.log('failure');
    }
  }
  req.send();
}

function updateResults(data) {
  var results = "";
  for (var i = 0; i < data.length; i++) {
    results += construct(data[i]);
  }
  search_results.innerHTML = results;
}

function construct(result) {
  return '<a href="https://en.wikipedia.org/wiki/' + encodeURIComponent(result.title) + '">' +
           '<div class="response">' +
             '<h2>' + result.title + '</h2>' +
             '<p>' + result.snippet + '...</p>' +
           '</div>' +
         '</a>';
}


search_field.addEventListener("keyup", function() {
  search(search_field.value, updateResults);
});
