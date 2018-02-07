var childProcess = require("child_process");
var constants = require("./constants");

module.exports = {
  start: function() {
    return childProcess.spawn("ping", [constants.PING_URL]);
  }
};
