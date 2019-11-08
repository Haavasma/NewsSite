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
//const sdao = require('./dao/sakdao.js');
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

bdao = new BrukerDao(pool);
sakdao = new SakDao(pool);
kategoridao = new KategoriDao(pool);
kommentardao = new KommentarDao(pool);
ratingdao = new RatingDao(pool);

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
/*app.use("/api", (req,res, next)=>{
    var token = req.headers["x-access-token"];
    jwt.verify(token, publicKEY.key, (err,decoded)=>{
        if(err) {
            console.log("Token IKKE ok");
            res.status(401);
            res.json({ error: "Not authorized"});
        }else{
            console.log("Token ok: "+ decoded.brukernavn);
            token = jwt.sign
            next();
        }
    })
}
);
*/

app.get("/api/nyheter", (req, res) => {
    console.log("Fikk request fra klient");
    sakdao.getNyheter((status, data) => {
        res.status(status);
        res.json(data);
      });
});

app.get("/api/nyheter/:sak_id", (req, res) => {
    console.log("Fikk request fra klient");
    sakdao.getNyhet(req.params.sak_id, (status, data)=>{
        res.status(status);
        res.json(data);
    });
});


/*
app.get("/api/kategori/:kategori",(req, res) => {
    console.log("Fikk request fra klient");
    pool.getConnection((err, connection) => {
        console.log("Connected to database");
        if (err) {
            console.log("Feil ved kobling til databasen");
            res.json({ error: "feil ved ved oppkobling" });
        } else {
            connection.query(
                "select sak_id, overskrift, innhold, tidspunkt, bilde, kategori, viktighet from sak WHERE kategori=?"
                ,req.params.kategori,
                (err, rows) => {
                    connection.release();
                    if (err) {
                        console.log(err);
                        res.json({ error: "error querying" });
                    } else {
                        console.log(rows);
                        res.json(rows);
                    }
                }
            );
        }
    });
});
*/

app.post("/api/nyheter", (req, res) => {
    console.log("Fikk POST-request fra klienten");
    console.log("Navn: " + req.body.navn);
    sakdao.lagNyhet(req.body, (status, data)=>{
        res.status(status);
        res.json(data);
    });
});

app.delete("/api/nyheter/", (req, res) => {
    console.log("Fikk DELETE-request fra klienten");
    sakdao.deleteNyhet(req.body, (status, data)=>{
        res.status(status);
        res.json(data);
    });
  
});

app.put("/api/nyheter/:sak_id", (req, res) => {
    console.log("Fikk PUT-request fra klienten");
    console.log("Navn: " + req.body.navn);
    sakdao.oppdaterNyhet(req.body, req.params.sak_id, (status, data)=>{
        res.status(status);
        res.json(data);
    });
});

app.get("/api/kategorier", (req, res) => {
    console.log("Fikk request fra klient");
    kategoridao.getKategorier((status, data)=>{
        res.status(status);
        res.json(data);
    });
});

app.get("/api/kommentar/:sak_id", (req, res) => {
    console.log("Fikk request fra klient");
    kommentardao.getKommentar(req.params.sak_id, (status, data)=>{
        res.status(status);
        res.json(data);
    })
});

app.post("/api/kommentar", (req, res) => {
    console.log("Fikk POST-request fra klienten");
    console.log("Navn: " + req.body.navn);
    kommentardao.addKommentar(req.body, (status, data)=>{
        res.status(status);
        res.json(data);
    });
});

app.post("/api/rating/:sak_id", (req, res) => {
    console.log("Fikk POST-request fra klienten");
    console.log("sakid: " + req.params.sak_id);
    ratingdao.addRating(req.body, req.params.sak_id, (status, data)=>{
        res.status(status);
        res.json(data);
    });
});
app.get("/api/rating/:sak_id", (req, res) => {
    console.log("Fikk GET-request fra klienten");
    console.log("sakid: " + req.params.sak_id);
    ratingdao.getRating(req.params.sak_id, (status, data)=>{
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

app.post("/api/login",(req,res)=>{
    console.log("Fikk POST-request fra klienten");
    bdao.getBruker(req.body, (status, data)=>{
        res.status(status);
        console.log(data[0].passord);
        bcrypt.compare(req.body.passord, data[0].passord, function(err, resp) {
            if(resp) {
                let token = jwt.sign({brukernavn: req.body.brukernavn}, privateKEY.key,{
                    expiresIn: 600
                });
                console.log("password matched");
                res.json({jwt: token});
            } else {
                console.log("password didnt match");
                res.status(401);
                res.json({error: "not authorized" });
            } 
          });
    })
});
  







var server = app.listen(4000);