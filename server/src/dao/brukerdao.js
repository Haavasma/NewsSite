const Dao: Dao  = require('./dao.js');
const bcrypt = require('bcrypt');
const saltRounds: number = 10;



module.exports = class BrukerDao extends Dao{
    getBruker(json: JSON, callback: function){
        super.query("select brukernavn, passord from bruker WHERE brukernavn = ?", [json.brukernavn], callback);
    }
    getPassord(json: JSON, callback: function){
        super.query("select passord from bruker where brukernavn = ?", [json.brukernavn], callback);
    }
    addBruker(json: JSON, callback: function){
        var salt = bcrypt.genSaltSync(saltRounds);
        var hash = bcrypt.hashSync(json.passord, salt);
        var val = [json.brukernavn, hash];
        super.query("insert into bruker values(?, ?)", val, callback);
    }
};

