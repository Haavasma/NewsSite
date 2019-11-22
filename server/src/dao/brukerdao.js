//@flow

const Dao: Dao  = require('./dao.js');
const bcrypt = require('bcrypt');
const saltRounds: number = 10;



module.exports = class BrukerDao extends Dao{
    getBruker(json: any, callback: function){
        super.query("select brukernavn, passord from bruker WHERE brukernavn = ?", [json.brukernavn], callback);
    }
    getPassord(json: any, callback: function){
        super.query("select passord from bruker where brukernavn = ?", [json.brukernavn], callback);
    }
    addBruker(json: any, callback: function){
        var salt: string = bcrypt.genSaltSync(saltRounds);
        var hash: string = bcrypt.hashSync(json.passord, salt);
        var val: string[] = [json.brukernavn, hash];
        super.query("insert into bruker values(?, ?)", val, callback);
    }
};

