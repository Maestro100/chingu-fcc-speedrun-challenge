
function Timer(seconds) {
  var time = seconds;
  var remaining = time;
  var running = false;

  // start countdown timer
  function start(cb) {
    var startTime = new Date(); // get start time
    var time = remaining; // create local time variable
    running = true; // set timer to running

    // every 1/10 of a second...
    var countdown = setInterval(function() {

      // if no time or timer stopped, CANCEL countdown
      if (!remaining || !running) {
        clearInterval(countdown);
      }
      else {
        // compare current time to start time
        var currTime = new Date();
        remaining = time - Math.floor((currTime - startTime) / 1000);
        if (remaining < 0) {
          remaining = 0;
        }

        // call cb and return
        if (cb) {
          return cb(remaining);
        }
      }
    }, 100);
  }

  function format() {
    var time = [];
    time[0] = Math.floor(remaining / 3600);
    time[1] = Math.floor(remaining % 3600 / 60);
    time[2] = Math.floor(remaining % 60);

    var formatted = time.map(function(x) {
      x = x.toString();
      x = x.length == 1 ? "0" + x : x;
      return x;
    });
    return formatted.join(":");
  }

  // return controllers for timer
  return {
    // start timer (takes callback function)
    start: start,

    // pause timer
    pause: function() {
      running = false;
    },

    // reset timer
    reset: function() {
      running = false;
      remaining = time;
    },

    // check whether timer is running
    isRunning: function() {
      return running;
    },

    // get seconds remaining
    getSeconds: function() {
      return remaining;
    },

    // function to format time
    format: format
  };
}

function showTime(time) {
  document.getElementById('timer').innerHTML = formatTime(time);
}
