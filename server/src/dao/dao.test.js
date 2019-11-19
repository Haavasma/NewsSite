var mysql = require("mysql");

const BrukerDao: BrukerDao = require("./brukerdao.js");
const KommentarDao = require("./kommentardao");
const SakDao = require("./sakdao");
const KategoriDao = require("./kategoridao");
const RatingDao = require("./ratingdao");
const runsqlfile = require("./runsqlfile.js");

// GitLab CI Pool
var pool: connection = mysql.createPool({
    connectionLimit: 1,
    host: "mysql",
    user: "root",
    password: "secret",
    database: "supertestdb",
    debug: false,
    multipleStatements: true
});

let brukerDao: BrukerDao = new BrukerDao(pool);
let kommentarDao: KommentarDao = new KommentarDao(pool);
let sakDao: SakDao = new SakDao(pool);
let kategoriDao: KategoriDao = new KategoriDao(pool);
let ratingDao: RatingDao = new RatingDao(pool);

beforeAll(done => {
    runsqlfile("src/dao/create_tables.sql", pool, () => {
        runsqlfile("src/dao/create_testdata.sql", pool, done);
        console.log("put up testData");
    });
});

afterAll(() => {
    pool.end();
});

test("get one bruker", done => {
    function callback(status, data) {
        console.log(status, data);
        expect(data.length).toBe(1);
        expect(data[0].brukernavn).toBe("Zanacion");
        expect(data[0].passord).toBe("secret");
        done();
    }
    brukerDao.getBruker({ brukernavn: "Zanacion" }, callback);
});

test("get passord", done => {
    function callback(status, data) {
        console.log(status, data);
        expect(data.length).toBe(1);
        expect(data[0].passord).toBe("secret");
        done();
    }
    brukerDao.getPassord({ brukernavn: "Zanacion" }, callback);
});

test("add bruker", done => {
    function callback(status, data) {
        console.log(status, data);
        expect(data.affectedRows).toBeGreaterThanOrEqual(1);
        done();
    }
    brukerDao.addBruker({ brukernavn: "harald", passord: "secret" }, callback);
});

test("get kategorier", done => {
    function callback(status, data) {
        console.log(status, data);
        expect(data.length).toBe(2)
        expect(data[0].kategori).toBe("Politikk");
        expect(data[1].kategori).toBe("Sport");
        done();
    }
    kategoriDao.getKategorier(callback);
});

test("get kommentar", done => {
    function callback(status, data) {
        console.log(status, data);
        expect(data[0].brukernavn).toBe("harald");
        done();
    }
    kommentarDao.getKommentar(2, callback);
});

test("add kommentar", done => {
    function callback(status, data) {
        console.log(status, data);
        expect(data.affectedRows).toBeGreaterThanOrEqual(1);
        done();
    }
    kommentarDao.addKommentar({
        brukernavn: "harald",
        kommentar: "secret",
        sak_id: 2
    }, callback);
});

test("get one Sak from db", done => {
    function callback(status, data) {
        console.log(status, data);
        expect(data.length).toBe(1);
        expect(data[0].brukernavn).toBe("Zanacion");
        done();
    }
    sakDao.getNyhet(1, callback);
});

test("get every Sak from db", done => {
    function callback(status, data) {
        console.log(status, data);
        expect(data.length).toBeGreaterThanOrEqual(1);
        expect(data[0].brukernavn).toBe("Zanacion");
        done();
    }
    sakDao.getNyheter(callback);
});

test("get brukernavn with sak_id", done => {
    function callback(status, data) {
        console.log(status, data);
        expect(data.length).toBe(1);
        expect(data[0].brukernavn).toBe("Zanacion");
        done();
    }
    sakDao.getBrukernavnAvSak_id(1, callback);
});
test("slett nyhetsSak", done => {
    function callback(status, data) {
        console.log(status, data);
        expect(data.affectedRows).toBeGreaterThanOrEqual(1);
        done();
    }
    sakDao.deleteNyhet({ sak_id: 1 }, callback);
});
test("update nyhetsSak", done => {
    function callback(status, data) {
        console.log(status, data);
        expect(data.affectedRows).toBeGreaterThanOrEqual(1);
        done();
    }
    sakDao.oppdaterNyhet({
        overskrift: "nyOverskrift",
        innhold: "nytt innhold",
        tidspunkt: "nå",
        bilde: "sladj",
        kategori: "Politikk",
        viktighet: 1
    }, 2, callback);
});
test("add nyhet", done => {
    function callback(status, data) {
        console.log(status, data);
        expect(data.affectedRows).toBeGreaterThanOrEqual(1);
        done();
    }
    sakDao.lagNyhet({
        brukernavn: "Zanacion",
        overskrift: "nyOverskrift",
        innhold: "nytt innhold",
        tidspunkt: "nå",
        bilde: "sladj",
        kategori: "Politikk",
        viktighet: 1
    }, callback)
});

test("get rating", done => {
    function callback(status, data) {
        console.log(status, data);
        expect(data.length).toBe(1);
        expect(data[0].avgRating).toBe(3);
        done();
    }
    ratingDao.getRating(2, callback);
});


test("add rating", done => {
    function callback(status, data) {
        console.log(status, data);
        expect(data.affectedRows).toBeGreaterThanOrEqual(1);
        done();
    }
    ratingDao.addRating({ rating: 3, brukernavn: "håvard" }, 2, callback);
});


