var electron = require("electron");
var constants = require("./src/constants");
var ping = require("./src/ping");

var app = electron.app;
var Menu = electron.Menu;
var Tray = electron.Tray;
var ICONS = constants.ICONS;

// App Events
app.on("window-all-closed", app.quit);
app.on("ready", initProcess);

/*
  * Init the app process
  * start ping
  * create tray
  * listen for ping output
*/
function initProcess() {
  var pingInstance = ping.start();
  var tray = createTray(ICONS.red);

  pingInstance.stdout.on("data", function(data) {
    if (isNetworkPinged(data)) {
      tray.setImage(ICONS.green);
    } else {
      tray.setImage(ICONS.red);
    }
  });
}

/**
 * @function createTray
 * @description creates a new tray instance out of input icon path
 * @param {string} icon Path to icon
 */
function createTray(icon) {
  var tray = new Tray(icon);
  var trayMenu = createMenu();

  tray.setToolTip("Ping " + app.getVersion());

  tray.on("click", function() {
    showTrayMenu(tray, trayMenu);
  });
  tray.on("right-click", function() {
    showTrayMenu(tray, trayMenu);
  });

  return tray;
}

/**
 * @function showTrayMenu
 * @description Shows context menu of Tray
 * @param {Tray} tray
 * @param {Menu} menu
 */
function showTrayMenu(tray, menu) {
  tray.popUpContextMenu(menu);
}

/**
 * @function createMenu
 * @description Returns menu built for tray
 */
function createMenu() {
  return Menu.buildFromTemplate([
    {
      label: "Quit",
      click: function() {
        app.quit();
      }
    }
  ]);
}

/**
 * @function isNetworkPinged
 * @description parses ping stdout for network checking
 * @param {string|Buffer} str Buffer or String
 */
function isNetworkPinged(str) {
  /**
   * stdout: <64 bytes from 172.217.22.14: icmp_seq=201 ttl=46 time=568.209 ms
   * stdout: <Request timeout for icmp_seq 6
   */

  // Convert Buffer to String
  if (typeof str !== "string") {
    str = str.toString("utf8");
  }
  return str.indexOf("timeout") === -1;
}
