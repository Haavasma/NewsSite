const Dao = require('./dao.js');

module.exports = class KommentarDao extends Dao {
    getRating(id, callback){
        super.query("SELECT AVG(rating) AS avgRating FROM `rating` WHERE sak_id = ?", [id], callback);
    }
    addRating(json, id, callback){
        var val = [json.rating, id, json.brukernavn];
        super.query("insert into rating(rating, sak_id, brukernavn) values (?, ?, ?)"
        ,val,
        callback);
    }
};