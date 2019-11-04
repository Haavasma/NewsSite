const dao = require('./dao.js');

module.exports = class KommentarDao extends Dao {
    getRating(id, callback){
        super.query("SELECT AVG(rating) AS avgRating FROM `rating` WHERE sak_id = ?", [id], callback);
    }
    addRating(json, id, callback){
        var val = [json.rating, id];
        super.query("insert into rating(rating_id, rating, sak_id) values (DEFAULT, ?, ?)"
        ,val,
        callback);
    }
};