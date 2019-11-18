var mysql = require("mysql");

const KommentarDao: KommentarDao = require("./kommentardao.js");
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

let kommentarDao: KommentarDao = new KommentarDao(pool);



afterAll(() => {
  pool.end();
});

test("get kommentar", done => {
  function callback(status, data) {
    console.log(status, data);
    expect(data[1].brukernavn).toBe("harald");
    done();
  }
  kommentarDao.getKommentar(2, callback);
});


test("add kommentar", done=>{
    function callback(status, data){
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


