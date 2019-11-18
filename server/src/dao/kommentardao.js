const Dao: Dao = require('./dao.js');

module.exports = class KommentarDao extends Dao {
    getKommentar(id: number, callback: function){
        super.query("select kommentar, brukernavn from kommentar where sak_id=?", [id], callback);
    }
    addKommentar(json: JSON, callback: function){
        var val: JSON[] = [json.kommentar, json.brukernavn, json.sak_id];
        super.query("insert into kommentar(kommentar_id, kommentar, brukernavn, sak_id) values (DEFAULT, ?, ?, ?)",
        val,
        callback);
    }
};