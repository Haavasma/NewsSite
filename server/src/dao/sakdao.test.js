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

test("get one Sak from db", done =>{
    function callback(status, data){
        console.log(status, data);
        expect(data.length).toBe(1);
        expect(data[0].brukernavn).toBe("Zanacion");
        done();
    }
    sakDao.getNyhet(1, callback);
});

test("get ever Sak from db", done =>{
  function callback(status, data){
    console.log(status, data);
    expect(data.length).toBe(2);
    expect(data[0].brukernavn).toBe("Zanacion");
    expect(data[0].overskrift).toBe("overskrift");
    expect(data[0].innhold).toBe("dette er et innhold");
  }
})