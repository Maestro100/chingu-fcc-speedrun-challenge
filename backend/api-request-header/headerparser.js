
// function to parse header info
function parseHeader(req) {
  var output = {};

  // get ip address
  output.ip = req.ip;

  // get system info
  var sys_info = req.get("User-Agent");
  output.system = sys_info.match(/\(([^\)]*)/)[1];

  // get languages preferences
  var langs = req.get("Accept-Language")
                 .split(",")
                 .map(function(x) {
                   x = x.split(";");
                   x[1] = x[1] ? Number(x[1].slice(2)) : 1;
                   return x;
                 })
                 .sort((x, y) => x[1] < y[1])
                 .map(x => x[0]);
  output.languages = langs;

  return output;
}

module.exports = parseHeader;
