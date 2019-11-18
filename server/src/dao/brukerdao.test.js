var mysql = require("mysql");

const SakDao = require("./brukerdao.js");
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
  brukerDao.getBruker({brukernavn: "Zanacion"},callback);
});

