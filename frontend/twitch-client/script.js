function getUserData(username) {
  var url = 'https://wind-bow.glitch.me/twitch-api/users/' + 'pokerstars';
  var results = {};
  fetch(url)
  .then(
    function fulfilled(response) {
      return response.json();
    }
  )
  .then(
    function fulfilled(data) {
      results.display_name = data.display_name || data.name;
      results.logo = data.logo;
      results._id = data._id;

      return getStreamData(data._id);
    }
  )
  .then(
    function fulfilled(response) {
      console.log(response);
      return response.json();
    }
  )
  .then(
    function fulfilled(data) {
      console.log(data);
    }
  );
}

function getStreamData(id) {
  var url = 'https://wind-bow.glitch.me/twitch-api/streams/' + 'lirik';
  return fetch(url);
}
