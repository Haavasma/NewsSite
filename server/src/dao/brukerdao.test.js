var mysql = require("mysql");

const BrukerDao = require("./brukerdao.js");
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
  brukerDao.getBruker({brukernavn: "Zanacion"},callback);
});

test("get passord", done=>{
    function callback(status, data){
        console.log(status, data);
        expect(data.length).toBe(1);
        expect(data[0].passord).toBe("secret");
        done();
    }
    brukerDao.getPassord({brukernavn: "Zanacion"}, callback);
});

test("add bruker", done=>{
    function callback(status, data){
        console.log(status, data);
        expect(data.affectedRows).toBeGreaterThanOrEqual(1);
        done();
    }
    brukerDao.addBruker({brukernavn: "harald", passord: "secret"}, callback);
});


