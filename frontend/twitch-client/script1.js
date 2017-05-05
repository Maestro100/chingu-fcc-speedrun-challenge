
// build user array
buildHTML(["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas", "brunofin"]);

// listener for buttons to filter users shown
document.getElementById('filters').addEventListener('click', function(e) {

  // elements I may need to change
  var offline_users = document.getElementsByClassName('offline');
  var online_users = document.getElementsByClassName('online');

  // let's filter
  if (e.target && e.target.id) {
    var id = e.target.id;
    if (id === 'show-all') {
      Array.prototype.forEach.call(offline_users, show);
      Array.prototype.forEach.call(online_users, show);
    }
    else if (id === 'show-online') {
      Array.prototype.forEach.call(offline_users, hide);
      Array.prototype.forEach.call(online_users, show);
    }
    else if (id === 'show-offline') {
      Array.prototype.forEach.call(online_users, hide);
      Array.prototype.forEach.call(offline_users, show);
    }
  }

  // helper functions
  function show(div) {
    div.style.display = 'block';
  }
  function hide(div) {
    div.style.display = 'none';
  }
});

// FUNCTIONS TO BUILD AND DISPLAY USER CONTENT
function buildHTML(users) {
  var divs = [];
  for (let i = 0; i < users.length; i++) {
    divs.push(buildUserBlock(users[i]));
  }
  return Promise.all(divs)
  .then(
    function fulfilled(divs) {
      document.getElementById("users-section").innerHTML = divs.join("");
    }
  );
}

function buildUserBlock(user) {
  return getData(user)
  .then(
    formatUserBlock,
    function rejected(error) {
      console.log(error);
      return "";
    }
  );
}

function formatUserBlock(userData) {
  if (userData.error) {
    return `
      <div class="offline user">
      <div class="userContent no-account">
        <h2>${userData.name}: account closed</h2>
      </div>
    `;
  }
  return `
  <a href="https://www.twitch.tv/${userData.name}">
    <div class="${userData.streaming ? "online" : "offline"} user">
      <img class="logo" src=${userData.logo || "http://placehold.it/300?text=No+Image+Found"}></img>
      <div class="userContent">
        <h2>${userData.display_name}</h2>
        <h3>${userData.streaming ? "Online: " + userData.streaming : "Offline"}</h3>
      </div>
    </div>
  </a>
  `;
}

function getData(username) {
  return Promise.all([getUserData(username), getStreamData(username)])
  .then(
    function fulfilled([user, stream]) {
      if (user.error) {
        return {
          name: username,
          error: user.message
        };
      }
      console.log(stream);
      return {
        name: username,
        display_name: user.display_name,
        logo: user.logo,
        streaming: stream.stream ? stream.stream.game : null
      };
    },
    function rejected(reason) {
      console.log(reason);
      return null;
    }
  );
}

function getUserData(username) {
  var url = 'https://wind-bow.glitch.me/twitch-api/users/' + username;
  return fetch(url)
  .then(
    function fulfilled(response) {
      return response.json();
    }
  );
}

function getStreamData(username) {
  var url = 'https://wind-bow.glitch.me/twitch-api/streams/' + username;
  return fetch(url)
  .then(
    function fulfilled(response) {
      return response.json();
    }
  );
}
