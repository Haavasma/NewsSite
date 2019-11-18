//@flow

var express = require("express");
const bcrypt = require('bcrypt');
const BrukerDao = require('./dao/brukerdao.js');
const SakDao = require('./dao/sakdao.js');
const KategoriDao = require('./dao/kategoridao.js')
const KommentarDao = require('./dao/kommentardao.js');
const RatingDao = require('./dao/ratingdao.js');
let fs = require('fs');
const privateKEY = require('./keys/private.json');
const publicKEY = require('./keys/public.json');
const path = ('path');
var jwt = require("jsonwebtoken");
var app = express();

var bodyParser = require("body-parser");
var apiRoutes = express.Router();
app.use(bodyParser.json()); // for å tolke JSON
var mysql = require("mysql");

var pool: pool = mysql.createPool({
    connectionLimit: 2,
    host: "mysql.stud.iie.ntnu.no",
    user: "haavasma",
    password: "CaMGxsUt",
    database: "haavasma",
    debug: false
});

var bdao: BrukerDao = new BrukerDao(pool);
var sakdao: SakDao = new SakDao(pool);
var kategoridao: KategoriDao = new KategoriDao(pool);
var kommentardao: KommentarDao = new KommentarDao(pool);
var ratingdao : RatingDao= new RatingDao(pool);

app.on('livefeed', (req, socket: WebSocket)=>{
    if(req.headers['livefeed']!=='websocket'){
        socket.close(101, "bad request");
        return;
    }else{
        socket.send("nice");
    }
});

app.use(function (req, res, next: function) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get("/api/nyheter", (req, res) => {
    console.log("Fikk request fra klient");
    sakdao.getNyheter((status, data) => {
        res.status(status);
        res.json(data);
    });
});

app.get("/api/uviktigeNyheter", (req, res) => {
    console.log("Fikk request fra klient");
    sakdao.getUviktigeNyheter((status, data) => {
        res.status(status);
        res.json(data);
    });
});

app.get("/api/nyheter/:sak_id", (req, res) => {
    console.log("Fikk request fra klient");
    sakdao.getNyhet(req.params.sak_id, (status, data) => {
        res.status(status);
        res.json(data);
    });
});

app.post("/api/nyheter", (req, res) => {
    console.log("Fikk POST-request fra klienten");
    console.log("Navn: " + req.body.navn);
    sakdao.lagNyhet(req.body, (status, data) => {
        res.status(status);
        res.json(data);
    });
});

app.delete("/api/nyheter/", (req, res) => {
    var token: string = req.headers["x-access-token"];
    jwt.verify(token, privateKEY.key, (err, decoded)=>{
        if(err){
            res.status(401);
            res.json({error: "Not authorized"});
        }else{
            sakdao.getBrukernavnAvSak_id(req.body.sak_id, (status, data)=>{
                if(data[0].brukernavn == decoded.brukernavn){
                    sakdao.deleteNyhet(req.body, (status, data)=>{
                        res.status(status);
                        let token: string = jwt.sign({ brukernavn: decoded.brukernavn }, privateKEY.key, {
                            expiresIn: 2000
                        });
                        res.json({jwt:token});
                    })
                }else{
                    res.status(401);
                    res.json({ error: "Not authorized"});    
                }
            })
        }
    })
});

app.put("/api/nyheter/:sak_id", (req, res) => {
    var token:string = req.headers["x-access-token"];
    console.log("token: "+ token);
    jwt.verify(token, privateKEY.key, (err, decoded) => {
        if (err) {
            console.log("token ikke ok");
            res.status(401);
            res.json({ error: "Not authorized" });
        } else {
            console.log("Token ok: " + decoded.brukernavn);
            sakdao.getBrukernavnAvSak_id(req.params.sak_id, (status, data)=>{
                console.log(data[0].brukernavn);
                if(data[0].brukernavn == decoded.brukernavn){
                    sakdao.oppdaterNyhet(req.body, req.params.sak_id,(status, data)=>{
                        res.status(status);
                        let token = jwt.sign({ brukernavn: decoded.brukernavn }, privateKEY.key, {
                            expiresIn: 2000
                        });
                        res.json({ jwt: token });
                    })
                }else{
                    res.status(401);
                    res.json({ error: "Not authorized"});
                }
            })
        }
    })
});

app.get("/api/kategorier", (req, res) => {
    console.log("Fikk request fra klient");
    kategoridao.getKategorier((status, data) => {
        res.status(status);
        res.json(data);
    });
});

app.get("/api/kommentar/:sak_id", (req, res) => {
    console.log("Fikk request fra klient");
    kommentardao.getKommentar(req.params.sak_id, (status, data) => {
        res.status(status);
        res.json(data);
    })
});

app.post("/api/kommentar", (req, res) => {
    console.log("Fikk POST-request fra klienten");
    console.log("Navn: " + req.body.navn);
    kommentardao.addKommentar(req.body, (status, data) => {
        res.status(status);
        res.json(data);
    });
});

app.post("/api/rating/:sak_id", (req, res) => {
    console.log("Fikk POST-request fra klienten");
    console.log("sakid: " + req.params.sak_id);
    ratingdao.addRating(req.body, req.params.sak_id, (status, data) => {
        res.status(status);
        res.json(data);
    });
});
app.get("/api/rating/:sak_id", (req, res) => {
    console.log("Fikk GET-request fra klienten");
    console.log("sakid: " + req.params.sak_id);
    ratingdao.getRating(req.params.sak_id, (status, data) => {
        res.status(status);
        res.json(data);
    });
});

app.post("/api/bruker", (req, res) => {
    console.log("Fikk POST-request fra klienten");
    bdao.addBruker(req.body, (status, data) => {
        res.status(status);
        res.json(data);
    });
});

app.post("/api/login", (req, res) => {
    console.log("Fikk POST-request fra klienten");
    bdao.getBruker(req.body, (status, data) => {
        res.status(status);
        if (data[0]) {
            bcrypt.compare(req.body.passord, data[0].passord, function (err, resp) {
                if (resp) {
                    let token: string = jwt.sign({ brukernavn: req.body.brukernavn }, privateKEY.key, {
                        expiresIn: 2000
                    });
                    console.log("password matched");
                    res.status(status);
                    res.json({ jwt: token });
                } else {
                    console.log("password didnt match");
                    res.status(401);
                    res.json({ error: "not authorized" });
                }
            });
        } else {
            res.status(401);
            res.json({ error: "user does not exist" });
        }
    });
});

app.post("/token", (req, res)=>{
    let token: string = req.headers["x-access-token"];
    console.log("token: "+ token )
    jwt.verify(token, privateKEY.key, (err, decoded)=>{
      if(err){
        console.log("Token utløpt");
        res.status(401);
        res.json({error: "not authorized"});
      }else{
        console.log("Token ok: " + decoded.brukernavn);
        console.log("token refreshed");
        token = jwt.sign({brukernavn: decoded.brukernavn}, privateKEY.key, {
          expiresIn:6
        });
        res.json({jwt: token, "brukernavn": decoded.brukernavn});
      }
    })
  })
  








var server = app.listen(4000);