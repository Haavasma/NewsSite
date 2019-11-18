var mysql = require("mysql");

const RatingDao: RatingDao = require("./ratingdao.js");
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

test("get rating", done => {
  function callback(status, data) {
    console.log(status, data);
    expect(data.length).toBe(1);
    expect(data[0].avgRating).toBe(3);
    done();
  }
  ratingDao.getRating(2, callback);
});


test("add rating", done=>{
    function callback(status, data){
        console.log(status, data);
        expect(data.affectedRows).toBeGreaterThanOrEqual(1);
        done();
    }
    ratingDao.addRating({rating: 3, brukernavn:"Zanacion"}, 2, callback);
});


