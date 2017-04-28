// identify HTML elements I'll need
var search_field = document.getElementById('search-field');
var rand_btn = document.getElementById('rand-btn');
var search_results = document.getElementById('search-results');

// request articles from wikipedia
function search(input, success) {
  input = encodeURIComponent(input);
  var url = "https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=extracts&exintro&exchars=250&exlimit=10&generator=search&gsrsearch=" + input + "&gsrlimit=10&formatversion=2";
  var req = new XMLHttpRequest();

  req.open("GET", url);
  //req.setRequestHeader('Api-User-Agent', 'Example/1.0');
  req.onload = function() {
    if (req.status === 200) {
      var response = JSON.parse(req.response);
      if (response.query && response.query.pages) {
        success(response.query.pages);
      }
      else {
        success([]);
      }
    }
    else {
      console.log('failure');
    }
  };
  req.send();
}

// update webpage with search results
function updateResults(data) {
  var results = "";
  for (var i = 0; i < data.length; i++) {
    results += construct(data[i]);
  }
  search_results.innerHTML = results;
}

// build div to hold results
function construct(result) {
  return '<div class="response">' +
           '<a href="https://en.wikipedia.org/wiki/' + encodeURIComponent(result.title) + '">' +
             '<h2>' + result.title + '</h2>' +
             result.extract +
           '</a>' +
         '</div>';
}

// listen for key-up event (to conduct search)
search_field.addEventListener("keyup", function() {
  if (search_field.value.length > 0) {
    search(search_field.value, updateResults);
  }
});

// set up "random article" button
rand_btn.addEventListener("click", function() {
  window.open("https://en.wikipedia.org/wiki/Special:Random");
});
