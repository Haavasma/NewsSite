module.exports = class Dao {
    constructor(pool: connection) {
      // Dependency Injection
      this.pool = pool;
    }
  
    query(sql: string, params: string[], callback: function) {
      this.pool.getConnection((err, connection) => {
        console.log("dao: connected to database");
        if (err) {
          console.log("dao: error connecting");
          callback(500, { error: "feil ved ved oppkobling" });
        } else {
          console.log("dao: running sql: " + sql);
          connection.query(sql, params, (err, rows) => {
            connection.release();
            if (err) {
              console.log(err);
              callback(500, { error: "error querying" });
            } else {
              console.log("dao: returning rows");
              callback(200, rows);
            }
          });
        }
      });
    }
  };
  