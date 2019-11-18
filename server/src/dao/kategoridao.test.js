var mysql = require("mysql");

const KategoriDao: KategoriDao = require("./kategoridao.js");
const runsqlfile: function = require("./runsqlfile.js");

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

let kategoriDao: KategoriDao = new KategoriDao(pool);

beforeAll(done => {
  runsqlfile("src/dao/create_tables.sql", pool, () => {
    runsqlfile("src/dao/create_testdata.sql", pool, done);
    console.log("put up testData");
  });
});

afterAll(() => {
  pool.end();
});

test("get kategorier", done => {
  function callback(status, data) {
    console.log(status, data);
    expect(data.length).toBe(2);
    expect(data[0].kategori).toBe("Politikk");
    expect(data[1].kategori).toBe("Sport");
    done();
  }
  kategoriDao.getKategorier(callback);
});



