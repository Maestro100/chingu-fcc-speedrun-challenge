// module to hold utility functions to get location

var request = require('request');

// given IP, get best guess at user's location
function getLocation(ip) {
  return new Promise(function(resolve, reject) {
    request("https://freegeoip.net/json/" + ip, function(error, response, body) {
      if (error) {
        reject(error);
      }
      else {
        body = JSON.parse(body);
        if (!body.longitude || !body.latitude) {
          reject("IP-based geolocation attempt failed: Missing longitude and/or latitude");
        }
        else {
          resolve({lat: body.latitude, lon: body.longitude});
        }
      }
    });
  });
}

// export function
module.exports.getLocationFromIP = getLocation;
