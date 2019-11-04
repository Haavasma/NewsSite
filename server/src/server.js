var express = require("express");
var mysql = require("mysql");
var app = express();
var pool = mysql.createPool({
    connectionLimit: 2,
    host: "mysql.stud.iie.ntnu.no",
    user: "haavasma",
    password: "CaMGxsUt",
    database: "haavasma",
    debug: false
});
var bodyParser = require("body-parser");
app.use(bodyParser.json()); // for å tolke JSON

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.get("/api/nyheter", (req, res) => {
    console.log("Fikk request fra klient");
    pool.getConnection((err, connection) => {
        console.log("Connected to database");
        if (err) {
            console.log("Feil ved kobling til databasen");
            res.json({ error: "feil ved ved oppkobling" });
        } else {
            connection.query(
                "select sak_id, overskrift, innhold, tidspunkt, bilde, kategori, viktighet from sak order by sak_id desc limit 100",
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

app.get("/api/nyheter/:sak_id", (req, res) => {
    console.log("Fikk request fra klient");
    pool.getConnection((err, connection) => {
        console.log("Connected to database");
        if (err) {
            console.log("Feil ved kobling til databasen");
            res.json({ error: "feil ved ved oppkobling" });
        } else {
            connection.query(
                "select sak_id, overskrift, innhold, tidspunkt, bilde, kategori, viktighet from sak where sak_id = ?"
                ,req.params.sak_id,
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

app.get("/api/viktigeNyheter",(req, res) => {
    console.log("Fikk request fra klient");
    pool.getConnection((err, connection) => {
        console.log("Connected to database");
        if (err) {
            console.log("Feil ved kobling til databasen");
            res.json({ error: "feil ved ved oppkobling" });
        } else {
            connection.query(
                "select sak_id, overskrift, innhold, tidspunkt, bilde, kategori, viktighet from sak WHERE viktighet=1",
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

app.post("/api/nyheter", (req, res) => {
    console.log("Fikk POST-request fra klienten");
    console.log("Navn: " + req.body.navn);
    pool.getConnection((err, connection) => {
        if (err) {
            console.log("Feil ved oppkobling");
            res.json({ error: "feil ved oppkobling" });
        } else {
            console.log("Fikk databasekobling");
            var val = [req.body.overskrift, req.body.innhold, req.body.tidspunkt, req.body.bilde, req.body.kategori, req.body.viktighet];
            connection.query(
                "insert into sak(sak_id, overskrift, innhold, tidspunkt, bilde, kategori, viktighet) values (DEFAULT, ?, ?, ?, ?, ?, ?)",
                val,
                err => {
                    connection.release();
                    if (err) {
                        console.log(err);
                        //8 / 8
                        res.status(500);
                        res.json({ error: "Feil ved insert" });
                    } else {
                        console.log("insert ok");
                        res.send("");
                    }
                }
            );
        }
    });
});

app.delete("/api/nyheter/", (req, res) => {
    console.log("Fikk DELETE-request fra klienten");
    pool.getConnection((err, connection) => {
        if (err) {
            console.log("Feil ved oppkobling");
            res.json({ error: "feil ved oppkobling" });
        } else {
            console.log("Fikk databasekobling");
            var val = [req.body.sak_id];
            console.log(req.body.sak_id);
            connection.query(
                "DELETE FROM sak where sak_id = ?",
                val,
                err => {
                    connection.release();
                    if (err) {
                        console.log(err);
                        //8 / 8
                        res.status(500);
                        res.json({ error: "Feil ved delete" });
                    } else {
                        console.log("delete ok");
                        res.send("");
                    }
                }
            );
        }
    });
});

app.put("/api/nyheter/:sak_id", (req, res) => {
    console.log("Fikk PUT-request fra klienten");
    console.log("Navn: " + req.body.navn);
    pool.getConnection((err, connection) => {
        if (err) {
            console.log("Feil ved oppkobling");
            res.json({ error: "feil ved oppkobling" });
        } else {
            console.log("Fikk databasekobling");
            var val = [req.body.overskrift, req.body.innhold, req.body.tidspunkt, req.body.bilde, req.body.kategori, req.body.viktighet, req.params.sak_id];
            connection.query(
                "Update sak SET overskrift = ?, innhold = ?, tidspunkt = ?, bilde = ?, kategori = ?, viktighet= ? WHERE sak_id = ?",
                val,
                err => {
                    connection.release();
                    if (err) {
                        console.log(err);
                        //8 / 8
                        res.status(500);
                        res.json({ error: "Feil ved update" });
                    } else {
                        console.log("update ok");
                        res.send("");
                    }
                }
            );
        }
    });
});

app.get("/api/kategorier", (req, res) => {
    console.log("Fikk request fra klient");
    pool.getConnection((err, connection) => {
        console.log("Connected to database");
        if (err) {
            console.log("Feil ved kobling til databasen");
            res.json({ error: "feil ved ved oppkobling" });
        } else {
            connection.query(
                "select kategori from kategori",
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

app.get("/api/kommentar/:sak_id", (req, res) => {
    console.log("Fikk request fra klient");
    pool.getConnection((err, connection) => {
        console.log("Connected to database");
        if (err) {
            console.log("Feil ved kobling til databasen");
            res.json({ error: "feil ved ved oppkobling" });
        } else {
            connection.query(
                "select kommentar, brukernavn from kommentar where sak_id=?",req.params.sak_id,
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

app.post("/api/kommentar", (req, res) => {
    console.log("Fikk POST-request fra klienten");
    console.log("Navn: " + req.body.navn);
    pool.getConnection((err, connection) => {
        if (err) {
            console.log("Feil ved oppkobling");
            res.json({ error: "feil ved oppkobling" });
        } else {
            console.log("Fikk databasekobling");
            var val = [req.body.kommentar, req.body.brukernavn, req.body.sak_id];
            connection.query(
                "insert into kommentar(kommentar_id, kommentar, brukernavn, sak_id) values (DEFAULT, ?, ?, ?)",
                val,
                err => {
                    connection.release();
                    if (err) {
                        console.log(err);
                        //8 / 8
                        res.status(500);
                        res.json({ error: "Feil ved insert" });
                    } else {
                        console.log("insert ok");
                        res.send("");
                    }
                }
            );
        }
    });
});

app.post("/api/rating/:sak_id", (req, res) => {
    console.log("Fikk POST-request fra klienten");
    console.log("sakid: " + req.params.sak_id);
    pool.getConnection((err, connection) => {
        if (err) {
            console.log("Feil ved oppkobling");
            res.json({ error: "feil ved oppkobling" });
        } else {
            console.log("Fikk databasekobling");
            var val = [req.body.rating, req.params.sak_id];
            connection.query(
                "insert into rating(rating_id, rating, sak_id) values (DEFAULT, ?, ?)",
                val,
                err => {
                    connection.release();
                    if (err) {
                        console.log(err);
                        res.status(500);
                        res.json({ error: "Feil ved insert" });
                    } else {
                        console.log("insert ok");
                        res.send("");
                    }
                }
            );
        }
    });
});
app.get("/api/rating/:sak_id", (req, res) => {
    console.log("Fikk GET-request fra klienten");
    console.log("sakid: " + req.params.sak_id);
    pool.getConnection((err, connection) => {
        if (err) {
            console.log("Feil ved oppkobling");
            res.json({ error: "feil ved oppkobling" });
        } else {
            console.log("Fikk databasekobling");
            var val = [req.body.rating, req.params.sak_id];
            connection.query(
                "SELECT AVG(rating) AS avgRating FROM `rating` WHERE sak_id = ?",
                req.params.sak_id,
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







var server = app.listen(4000);