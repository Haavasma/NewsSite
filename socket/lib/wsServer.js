"use strict";

var express = require("express");

var axios = require("axios");

var socketio = require("socket.io");

var app = express();
var server = app.listen(4001, function () {
  return console.log("Listening on port 4001");
});
var io = socketio(server);
var interval;
io.on("connection", function (socket) {
  console.log("Ny klient tilkoblet");

  if (interval) {
    clearInterval(interval);
  }

  interval = setInterval(function () {
    getLiveFeedAndEmit(socket);
  }, 1000);
  socket.on("disconnect", function () {
    console.log("Klient koblet fra");
  });
});

var getLiveFeedAndEmit = function getLiveFeedAndEmit(socket) {
  var res;
  return regeneratorRuntime.async(function getLiveFeedAndEmit$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(axios.get('http://localhost:4000/uviktigeNyheter'));

        case 3:
          res = _context.sent;
          socket.emit("livefeed", res.data);
          _context.next = 10;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          console.error("Error", _context.t0.code);

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
};