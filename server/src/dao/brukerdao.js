const Dao  = require('./dao.js');
const bcrypt = require('bcrypt');
const saltRounds= 10;



module.exports = class BrukerDao extends Dao{
    getBruker(json, callback){
        super.query("select brukernavn, passord, bruker_id from bruker WHERE brukernavn = ?", [json.brukernavn], callback);
    }
    getPassord(id, callback){
        super.query("select passord from bruker where bruker_id = ?", [id], callback);
    }
    addBruker(json, callback){
        var salt = bcrypt.genSaltSync(saltRounds);
        var hash = bcrypt.hashSync(json.passord, salt);
        var val = [json.brukernavn, hash];
        super.query("insert into bruker values(DEFAULT, ?, ?)", val, callback);
    }
};

