const Dao: Dao  = require('./dao.js');

module.exports = class KategoriDao extends Dao {
    getKategorier(callback: function){
        super.query("select kategori from kategori", [], callback);
    }
};