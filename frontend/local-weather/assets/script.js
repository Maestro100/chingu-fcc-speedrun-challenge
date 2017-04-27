// GET BACKGROUND IMAGE
var icon = document.getElementById("icon");
if (icon) {
  var icon_val = icon.getAttribute("src").slice(-7, -5);
  document.body.style.background = 'url("/backgrounds/' + icon_val + '.jpg") no-repeat center center fixed';
}

// HANDLES F->C AND C->F CONVERSION
var tempDiv = document.getElementById("temp");
tempDiv.addEventListener("click", function() {
  // get temperature
  var temp = +tempDiv.innerHTML.slice(0, tempDiv.innerHTML.indexOf("<"));
  console.log(temp);

  // get units
  var unitsDiv = document.getElementById("temp-units");
  var units = unitsDiv.innerHTML.slice(1);
  console.log(units);

  // convert from C->F or F->C
  if (units == "C") {
    temp = Math.round(temp * 1.8 + 32);
    units = "F";
  }
  else {
    temp = Math.round((temp - 32) / 1.8);
    units = "C";
  }

  // update html with new value
  tempDiv.innerHTML = temp + '<span id="temp-units">&deg;' + units + '</span>';
});
