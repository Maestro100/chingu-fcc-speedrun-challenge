
function Timer(name, minutes) {
  var time = 60 * minutes;
  var remaining = time;
  var running = false;

  // start countdown timer
  // cb takes two params: formatted time string, timer completion status
  function start(cb) {
    var startTime = new Date(); // get start time
    var time = remaining; // create local time variable
    running = true; // set timer to running

    // every 1/10 of a second...
    var countdown = setInterval(function() {

      // if no time or timer stopped, CANCEL countdown
      if (!remaining || !running) {
        cb(getTime(), !remaining);
        running = false;
        clearInterval(countdown);
      }
      else {
        // update time remaining
        var currTime = new Date();
        remaining = Math.max(time - Math.floor((currTime - startTime) / 1000), 0);
        cb(getTime(), false);
      }
    }, 20);
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

  // check if timer is running
  function isRunning() {
    return running;
  }

  // get name of timer
  function getName() {
    return name;
  }

  // get original length/duration
  function len() {
    return time / 60;
  }

  // return controllers for timer
  return {
    start: start,
    pause: pause,
    reset: reset,
    getTime: getTime,
    isRunning: isRunning,
    getName: getName,
    len: len
  };
}

(function Pomodoro() {
  var pomodoro = Timer("Pomodoro", 25);
  var breaktime = Timer("Breaktime", 5);
  var current = pomodoro;

  var bzzz = new Audio('bzzz.mp3');

  function updateDisplay() {
    document.getElementById("title").innerHTML = current.getName();
    document.getElementById("timer").innerHTML = current.getTime();
    document.getElementById("control-btn").className = current.isRunning() ? "fa fa-pause" : "fa fa-play";
    formatSettings();
  }

  function startTimer() {
    current.start(handleTimer);
    updateDisplay();
  }

  function pauseTimer() {
    current.pause();
    updateDisplay();
  }

  function handleTimer(time, done) {
    if (done) {
      // alert complete and reset current timer
      bzzz.play();
      setTimeout(function() {
        bzzz.play();
      }, 2000);
      current.reset();
      setTimeout(function() {
        // update current and start
        current = (current == pomodoro) ? breaktime : pomodoro;
        startTimer();
      }, 4000);

    }
    else {
      // print time to screen
      document.getElementById("timer").innerHTML = time;
    }
  }

  function updateTimer(name, str) {
    var val = (str == "-incr") ? 1 : -1;
    if (name == pomodoro.getName()) {
      pomodoro = Timer("Pomodoro", Math.max(pomodoro.len() + val, 1));
      current = pomodoro;
    }
    else if (name == breaktime.getName()) {
      breaktime = Timer("Breaktime", Math.max(breaktime.len() + val, 1));
      current = breaktime;
    }
  }

  function formatSettings() {
    var timers = [pomodoro, breaktime];
    for (var i = 0; i < timers.length; i++) {
      var curr = document.getElementById(timers[i].getName() + "-curr");
      if (current == timers[i]) {
        curr.innerHTML = '<i class="fa fa-caret-right" aria-hidden="true"></i>';
      }
      else {
        curr.innerHTML = "";
      }
      document.getElementById(timers[i].getName() + "-len").innerHTML = timers[i].len();
    }
  }

  function setup() {
    // print initial values to screen
    updateDisplay();

    // add event listener for start/pause button
    document.getElementById("control-btn").addEventListener("click", function() {
      if (!current.isRunning()) {
        startTimer();
      }
      else {
        pauseTimer();
      }
    });

    // add event listeners to open and close settings div
    document.getElementById("settings-icon").addEventListener("click", function() {
      var panel = document.getElementById("settings-panel");
      panel.className = (panel.className == "open") ? "closed" : "open";
    });

    // add event listeners to change settings
    document.getElementById("settings").addEventListener("click", function(e) {
      if (e.target && e.target.id) {
        var name = e.target.id.slice(0, -5);
        var suffix = e.target.id.slice(-5);

        // switch between pomodoro and breaktime timers
        if (suffix == "-name") {
          pauseTimer();
          current.reset();

          // give current timer time to clear
          setTimeout(function() {
            if (current.getName() !== name) {
              current = (current == pomodoro) ? breaktime : pomodoro;
            }
            updateDisplay();
          }, 100);
        }
        else if (suffix == "-incr" || suffix == "-decr") {
          pauseTimer();
          current.reset();

          setTimeout(function() {
            updateTimer(name, suffix);
            updateDisplay();
          }, 100);
        }
      }
    });
  }

  setup();
})();
