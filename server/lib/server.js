"use strict";

var express = require("express");

var bcrypt = require('bcrypt');

var BrukerDao = require('./dao/brukerdao.js');

var SakDao = require('./dao/sakdao.js');

var KategoriDao = require('./dao/kategoridao.js');

var KommentarDao = require('./dao/kommentardao.js');

var RatingDao = require('./dao/ratingdao.js');

var fs = require('fs');

var privateKEY = require('./keys/private.json');

var publicKEY = require('./keys/public.json');

var path = 'path';

var jwt = require("jsonwebtoken");

var app = express();

var bodyParser = require("body-parser");

var apiRoutes = express.Router();
app.use(bodyParser.json()); // for å tolke JSON

var mysql = require("mysql");

var pool = mysql.createPool({
  connectionLimit: 2,
  host: "mysql.stud.iie.ntnu.no",
  user: "haavasma",
  password: "CaMGxsUt",
  database: "haavasma",
  debug: false
});
var bdao = new BrukerDao(pool);
var sakdao = new SakDao(pool);
var kategoridao = new KategoriDao(pool);
var kommentardao = new KommentarDao(pool);
var ratingdao = new RatingDao(pool);
app.on('livefeed', function (req, socket) {
  if (req.headers['livefeed'] !== 'websocket') {
    socket.close(101, "bad request");
    return;
  } else {
    socket.send("nice");
  }
});
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from

  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.get("/api/nyheter", function (req, res) {
  console.log("Fikk request fra klient");
  sakdao.getNyheter(function (status, data) {
    res.status(status);
    res.json(data);
  });
});
app.get("/api/uviktigeNyheter", function (req, res) {
  console.log("Fikk request fra klient");
  sakdao.getUviktigeNyheter(function (status, data) {
    res.status(status);
    res.json(data);
  });
});
app.get("/api/nyheter/:sak_id", function (req, res) {
  console.log("Fikk request fra klient");
  sakdao.getNyhet(req.params.sak_id, function (status, data) {
    res.status(status);
    res.json(data);
  });
});
app.post("/api/nyheter", function (req, res) {
  console.log("Fikk POST-request fra klienten");
  console.log("Navn: " + req.body.navn);
  sakdao.lagNyhet(req.body, function (status, data) {
    res.status(status);
    res.json(data);
  });
});
app["delete"]("/api/nyheter/", function (req, res) {
  var token = req.headers["x-access-token"];
  jwt.verify(token, privateKEY.key, function (err, decoded) {
    if (err) {
      res.status(401);
      res.json({
        error: "Not authorized"
      });
    } else {
      sakdao.getBrukernavnAvSak_id(req.body.sak_id, function (status, data) {
        if (data[0].brukernavn == decoded.brukernavn) {
          sakdao.deleteNyhet(req.body, function (status, data) {
            res.status(status);
            var token = jwt.sign({
              brukernavn: decoded.brukernavn
            }, privateKEY.key, {
              expiresIn: 2000
            });
            res.json({
              jwt: token
            });
          });
        } else {
          res.status(401);
          res.json({
            error: "Not authorized"
          });
        }
      });
    }
  });
});
app.put("/api/nyheter/:sak_id", function (req, res) {
  var token = req.headers["x-access-token"];
  console.log("token: " + token);
  jwt.verify(token, privateKEY.key, function (err, decoded) {
    if (err) {
      console.log("token ikke ok");
      res.status(401);
      res.json({
        error: "Not authorized"
      });
    } else {
      console.log("Token ok: " + decoded.brukernavn);
      sakdao.getBrukernavnAvSak_id(req.params.sak_id, function (status, data) {
        console.log(data[0].brukernavn);

        if (data[0].brukernavn == decoded.brukernavn) {
          sakdao.oppdaterNyhet(req.body, req.params.sak_id, function (status, data) {
            res.status(status);
            var token = jwt.sign({
              brukernavn: decoded.brukernavn
            }, privateKEY.key, {
              expiresIn: 2000
            });
            res.json({
              jwt: token
            });
          });
        } else {
          res.status(401);
          res.json({
            error: "Not authorized"
          });
        }
      });
    }
  });
});
app.get("/api/kategorier", function (req, res) {
  console.log("Fikk request fra klient");
  kategoridao.getKategorier(function (status, data) {
    res.status(status);
    res.json(data);
  });
});
app.get("/api/kommentar/:sak_id", function (req, res) {
  console.log("Fikk request fra klient");
  kommentardao.getKommentar(req.params.sak_id, function (status, data) {
    res.status(status);
    res.json(data);
  });
});
app.post("/api/kommentar", function (req, res) {
  console.log("Fikk POST-request fra klienten");
  console.log("Navn: " + req.body.navn);
  kommentardao.addKommentar(req.body, function (status, data) {
    res.status(status);
    res.json(data);
  });
});
app.post("/api/rating/:sak_id", function (req, res) {
  console.log("Fikk POST-request fra klienten");
  console.log("sakid: " + req.params.sak_id);
  ratingdao.addRating(req.body, req.params.sak_id, function (status, data) {
    res.status(status);
    res.json(data);
  });
});
app.get("/api/rating/:sak_id", function (req, res) {
  console.log("Fikk GET-request fra klienten");
  console.log("sakid: " + req.params.sak_id);
  ratingdao.getRating(req.params.sak_id, function (status, data) {
    res.status(status);
    res.json(data);
  });
});
app.post("/api/bruker", function (req, res) {
  console.log("Fikk POST-request fra klienten");
  bdao.addBruker(req.body, function (status, data) {
    res.status(status);
    res.json(data);
  });
});
app.post("/api/login", function (req, res) {
  console.log("Fikk POST-request fra klienten");
  bdao.getBruker(req.body, function (status, data) {
    res.status(status);

    if (data[0]) {
      bcrypt.compare(req.body.passord, data[0].passord, function (err, resp) {
        if (resp) {
          var token = jwt.sign({
            brukernavn: req.body.brukernavn
          }, privateKEY.key, {
            expiresIn: 2000
          });
          console.log("password matched");
          res.status(status);
          res.json({
            jwt: token
          });
        } else {
          console.log("password didnt match");
          res.status(401);
          res.json({
            error: "not authorized"
          });
        }
      });
    } else {
      res.status(401);
      res.json({
        error: "user does not exist"
      });
    }
  });
});
app.post("/token", function (req, res) {
  var token = req.headers["x-access-token"];
  console.log("token: " + token);
  jwt.verify(token, privateKEY.key, function (err, decoded) {
    if (err) {
      console.log("Token utløpt");
      res.status(401);
      res.json({
        error: "not authorized"
      });
    } else {
      console.log("Token ok: " + decoded.brukernavn);
      console.log("token refreshed");
      token = jwt.sign({
        brukernavn: decoded.brukernavn
      }, privateKEY.key, {
        expiresIn: 2000
      });
      res.json({
        jwt: token,
        "brukernavn": decoded.brukernavn
      });
    }
  });
});
var server = app.listen(4000);