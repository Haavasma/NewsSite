const Dao: Dao  = require('./dao.js');

module.exports = class SakDao extends Dao {
    getNyheter(callback: function){
        super.query("select sak_id, brukernavn, overskrift, innhold, tidspunkt, bilde, kategori, viktighet from sak order by sak_id desc limit 100",[], callback);
    }
    getNyhet(id: number, callback: function){
        super.query("select sak_id, brukernavn, overskrift, innhold, tidspunkt, bilde, kategori, viktighet from sak where sak_id = ?",[id], callback);
    }
    getBrukernavnAvSak_id(id: number, callback: function){
        super.query("select brukernavn from sak WHERE sak_id = ?", [id], callback);
    }
    getUviktigeNyheter(callback: function){
        super.query("select sak_id, brukernavn, overskrift, innhold, tidspunkt, bilde, kategori, viktighet from sak WHERE viktighet = 0 order by sak_id desc limit 100",[], callback);
    }
    lagNyhet(json: JSON, callback: function){
        var val: array = [json.brukernavn, json.overskrift, json.innhold, json.tidspunkt, json.bilde, json.kategori, json.viktighet];
        super.query("insert into sak(sak_id, brukernavn, overskrift, innhold, tidspunkt, bilde, kategori, viktighet) values (DEFAULT, ?, ?, ?, ?, ?, ?, ?)",
        val,
        callback
        );
    }
    deleteNyhet(json: JSON, callback: function){
        var val: array  = [json.sak_id];
        super.query("DELETE FROM sak where sak_id = ?", val , callback);
    }
    oppdaterNyhet(json: JSON, id: number, callback: function){
        var val: array = [json.overskrift, json.innhold, json.tidspunkt, json.bilde, json.kategori, json.viktighet, id];
        super.query("Update sak SET overskrift = ?, innhold = ?, tidspunkt = ?, bilde = ?, kategori = ?, viktighet= ? WHERE sak_id = ?",
        val,
        callback);
    }
};
