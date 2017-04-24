
function Timer(name, seconds, minutes, hours) {
  var time = seconds + (60 * minutes) + (3600 * hours);
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
        cb(getTime(), !remaining); // sends out time, complete status
        running = false; // stops timer & marks it stopped
        clearInterval(countdown);
      }
      else {
        // update time remaining
        var currTime = new Date();
        remaining = time - Math.floor((currTime - startTime) / 1000);
        if (remaining < 0) {
          remaining = 0;
        }

        // call cb and return
        cb(getTime(), false);
      }
    }, 100);
  }

  // pause timer
  function pause() {
    running = false;
  }

  // reset timer
  function reset() {
    running = false;
    remaining = time;
  }

  // get timer remaining: "hh:mm:ss"
  function getTime() {
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

  function isRunning() {
    return running;
  }

  function getName() {
    return name;
  }
  // return controllers for timer
  return {
    start: start,
    pause: pause,
    reset: reset,
    getTime: getTime,
    isRunning: isRunning,
    getName: getName
  };
}

function Pomodoro() {
  var pomodoro = Timer("Pomodoro", 25, 0, 0);
  var breaktime = Timer("Breaktime", 5, 0, 0);
  var current = pomodoro;

  function startTimer() {
    current.start(handleTimer);
    document.getElementById("title").innerHTML = current.getName();
    document.getElementById("control").innerHTML = "PAUSE";
  }

  function pauseTimer() {
    current.pause();
    document.getElementById("control").innerHTML = "START";
  }

  function handleTimer(time, done) {
    if (done) {
      // alert complete and reset current timer
      console.log(current.getName() + " DONE!!!");
      current.reset();

      // update current and start
      current = (current == pomodoro) ? breaktime : pomodoro;
      startTimer();
    }
    else {
      console.log(time);
    }
  }


  function setup() {
    // add event listener for start/pause button
    document.getElementById("control").addEventListener("click", function() {
      if (!current.isRunning()) {
        startTimer();
      }
      else {
        pauseTimer();
      }
    });

    document.getElementById("settings").addEventListener("mouseover", function() {
      document.getElementById("settings-panel").className = "open";
    });

    document.getElementById("settings").addEventListener("mouseout", function() {
      document.getElementById("settings-panel").className = "closed";
    });
  }

  return {
    setup: setup
  };
}

var pom = Pomodoro();
pom.setup();
