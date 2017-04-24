
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
        remaining = time - Math.floor((currTime - startTime) / 1000);
        if (remaining < 0) {
          remaining = 0;
        }
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

  function isRunning() {
    return running;
  }

  function getName() {
    return name;
  }

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

function Pomodoro() {
  var pomodoro = Timer("Pomodoro", 25);
  var breaktime = Timer("Breaktime", 5);
  var current = pomodoro;

  var play_icon = "<i class=\"fa fa-play\" aria-hidden=\"true\"></i>";
  var pause_icon = "<i class=\"fa fa-pause\" aria-hidden=\"true\"></i>";

  var bzzz = new Audio('bzzz.mp3');

  function startTimer() {
    current.start(handleTimer);
    document.getElementById("title").innerHTML = current.getName();
    document.getElementById("timer").innerHTML = current.getTime();
    document.getElementById("control").innerHTML = pause_icon;
    formatSettings();
  }

  function pauseTimer() {
    current.pause();
    document.getElementById("control").innerHTML = play_icon;
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

  function formatSettings() {
    var timers = [pomodoro, breaktime];
    for (var i = 0; i < timers.length; i++) {
      var el = document.getElementById(timers[i].getName() + "-settings");
      var content = "";
      if (current == timers[i]) {
        content += "<div class=\"curr set\"><i class=\"fa fa-caret-right\" aria-hidden=\"true\"></i></div>";
      }
      else {
      content += "<div class=\"curr set\"></div>";
      }
      content += "<div class=\"set\" id=\"" + timers[i].getName() + "-name\">" + timers[i].getName() + "</div>";
      content += "<div class=\"set\" id=\"" + timers[i].getName() + "-time\">" +
      '<i id="' + timers[i].getName() + '-incr" class="fa fa-caret-up time" aria-hidden="true"></i>' +
      '<div class="time">' + timers[i].len() + '</div>' +
      '<i id="' + timers[i].getName() + '-decr" class="fa fa-caret-down time" aria-hidden="true"></i>' +
      "</div>";
      el.innerHTML = content;
    }
  }

  function setup() {
    // print initial values to screen
    document.getElementById("title").innerHTML = current.getName();
    document.getElementById("timer").innerHTML = current.getTime();
    document.getElementById("control").innerHTML = play_icon;
    formatSettings();

    // add event listener for start/pause button
    document.getElementById("control").addEventListener("click", function() {
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

    // add event listeners to manually change current timer, reset
    document.getElementById("settings").addEventListener("click", function(e) {
      console.log(e.target.id);
      if (e.target && e.target.id.slice(-5) == "-name") {
        pauseTimer();
        current.reset();

        // give current timer time to clear
        setTimeout(function() {
          var name = e.target.id.slice(0, -5);
          if (current.getName() !== name) {
            current = (current == pomodoro) ? breaktime : pomodoro;
          }
          document.getElementById("title").innerHTML = current.getName();
          document.getElementById("timer").innerHTML = current.getTime();
          document.getElementById("control").innerHTML = play_icon;
          formatSettings();
        }, 100);
      }

      else if (e.target && e.target.id.slice(-5) == "-incr") {
        var name = e.target.id.slice(0, -5);
        pauseTimer();
        current.reset();
        setTimeout(function() {
        if (name == pomodoro.getName()) {
          pomodoro = Timer("Pomodoro", pomodoro.len() + 1);
          current = pomodoro;
        }
        else if (name == breaktime.getName()) {
          breaktime = Timer("Breaktime", breaktime.len() + 1);
          current = breaktime;
        }
        console.log(current, current.len());

          // print initial values to screen
          document.getElementById("title").innerHTML = current.getName();
          document.getElementById("timer").innerHTML = current.getTime();
          document.getElementById("control").innerHTML = play_icon;
          formatSettings();
        }, 100);
      }

      else if (e.target && e.target.id.slice(-5) == "-decr") {
        var name = e.target.id.slice(0, -5);
        pauseTimer();
        current.reset();
        setTimeout(function() {
        if (name == pomodoro.getName()) {
          if (pomodoro.len() > 1) {
            pomodoro = Timer("Pomodoro", pomodoro.len() - 1);
          }
          current = pomodoro;
        }
        else if (name == breaktime.getName()) {
          if (breaktime.len() > 1) {
            breaktime = Timer("Breaktime", breaktime.len() - 1);
          }
          current = breaktime;
        }

          // print initial values to screen
          document.getElementById("title").innerHTML = current.getName();
          document.getElementById("timer").innerHTML = current.getTime();
          document.getElementById("control").innerHTML = play_icon;
          formatSettings();
        }, 200);
      }
    });
  }

  return {
    setup: setup
  };
}

var pom = Pomodoro();
pom.setup();
