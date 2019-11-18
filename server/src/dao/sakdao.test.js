var mysql = require("mysql");

const SakDao = require("./sakdao.js");
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

let sakDao: SakDao = new SakDao(pool);

beforeAll(done => {
  runsqlfile("src/dao/create_tables.sql", pool, () => {
    runsqlfile("src/dao/create_testdata.sql", pool, done);
    console.log("put up testData");
  });
});

afterAll(() => {
  pool.end();
});

test("get one Sak from db", done => {
  function callback(status, data) {
    console.log(status, data);
    expect(data.length).toBe(1);
    expect(data[0].brukernavn).toBe("Zanacion");
    done();
  }
  sakDao.getNyhet(3, callback);
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
test("slett nyhetsSak", done =>{
  function callback(status, data){
    console.log(status, data);
    expect(data.affectedRows).toBeGreaterThanOrEqual(1);
    done();
  }
  sakDao.deleteNyhet({sak_id: 1}, callback);
});
test("update nyhetsSak", done=>{
  function callback(status, data){
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
test("add nyhet", done=>{
  function callback(status, data){
    console.log(status, data);
    expect(data.affectedRows).toBeGreaterThanOrEqual(1);
    done();
  }
  sakDao.lagNyhet({
    brukernavn:"Zanacion",
    overskrift: "nyOverskrift",
    innhold: "nytt innhold",
    tidspunkt: "nå",
    bilde: "sladj",
    kategori: "Politikk",
    viktighet: 1
  }, callback)
});

