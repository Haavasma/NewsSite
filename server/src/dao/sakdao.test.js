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
  runsqlfile("dao/create_tables.sql", pool, () => {
    runsqlfile("dao/create_testdata.sql", pool, done);
  });
});

afterAll(() => {
  pool.end();
});

test("get one Sak from db", done =>{
    function callback(status, data){
        console.log(status, data);
        expect(data.length).toBe(1);
        expect(data[0].brukernavn).toBe("Zanacion");
        done();
    }
    sakDao.getNyhet(1, callback);
});