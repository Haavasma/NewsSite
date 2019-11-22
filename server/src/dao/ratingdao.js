//@flow

const Dao: Dao = require('./dao.js');

module.exports = class KommentarDao extends Dao {
    getRating(id: number, callback: function){
        super.query("SELECT AVG(rating) AS avgRating FROM `rating` WHERE sak_id = ?", [id], callback);
    }
    addRating(json: any, id: number, callback: function){
        var val: string[] = [json.rating, id.toString(), json.brukernavn];
        super.query("insert into rating(rating, sak_id, brukernavn) values (?, ?, ?)"
        ,val,
        callback);
    }
};