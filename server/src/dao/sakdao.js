const Dao  = require('./dao.js');

module.exports = class SakDao extends Dao {
    getNyheter(callback){
        super.query("select sak_id, brukernavn, overskrift, innhold, tidspunkt, bilde, kategori, viktighet from sak order by sak_id desc limit 100",[], callback);
    }
    getNyhet(id, callback){
        super.query("select sak_id, brukernavn, overskrift, innhold, tidspunkt, bilde, kategori, viktighet from sak where sak_id = ?",[id], callback);
    }
    getBrukernavnAvSak_id(id, callback){
        super.query("select brukernavn from sak WHERE sak_id = ?", [id], callback);
    }
    lagNyhet(json, callback){
        var val = [json.brukernavn, json.overskrift, json.innhold, json.tidspunkt, json.bilde, json.kategori, json.viktighet];
        super.query("insert into sak(sak_id, brukernavn, overskrift, innhold, tidspunkt, bilde, kategori, viktighet) values (DEFAULT, ?, ?, ?, ?, ?, ?, ?)",
        val,
        callback
        );
    }
    deleteNyhet(json, callback){
        var val  = [json.sak_id];
        super.query("DELETE FROM sak where sak_id = ?", val , callback);
    }
    oppdaterNyhet(json, id, callback){
        var val = [json.overskrift, json.innhold, json.tidspunkt, json.bilde, json.kategori, json.viktighet, id];
        super.query("Update sak SET overskrift = ?, innhold = ?, tidspunkt = ?, bilde = ?, kategori = ?, viktighet= ? WHERE sak_id = ?",
        val,
        callback);
    }
};
