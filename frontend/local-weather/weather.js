// functions to get and format weather (from OpenWeatherMap)

var request = require('request');

// use "request" to get data from OpenWeatherMap API
function requestWeatherData(location, key) {
  var url = "http://api.openweathermap.org/data/2.5/weather\?";

  // return promise - reject if error, else resolve
  return new Promise(function(resolve, reject) {
    request(url +
          "lat=" + location.lat +
          "&lon=" + location.lon +
          "&units=metric" +
          "&APPID=" + key,
          function(error, response, body) {
            if (error) {
              reject(error);
            }
            else {
              resolve(body);
            }
          }
    );
  });
}

// format data - returns variables for homepage template
function processWeatherInput(body) {

  // promise: reject if body code != 200, else resolve
  return new Promise(function(resolve, reject) {
    body = JSON.parse(body);
    if (body.cod != 200) {
      console.log(body.cod + ": " + body.message);
      reject("error: " + body.message);
    }
    else {
      resolve(formatData(body));
    }
  });

  function formatData(data) {
    return {
        desc: data.weather[0].description || "",
        icon_url: data.weather[0].icon ? "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png" : "",
        loc: data.weather.name || "",
        temp: data.main.temp || "",
        humidity: data.main.humidity || "",
        wind: data.wind.speed || ""
    };
  }
}

// export functions
module.exports.requestData = requestWeatherData;
module.exports.processData = processWeatherInput;
