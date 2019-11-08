const Dao  = require('./dao.js');

module.exports = class KategoriDao extends Dao {
    getKategorier(callback){
        super.query("select kategori from kategori", [], callback);
    }
};