"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Dao = require('./dao.js');

module.exports =
/*#__PURE__*/
function (_Dao) {
  _inherits(SakDao, _Dao);

  function SakDao() {
    _classCallCheck(this, SakDao);

    return _possibleConstructorReturn(this, _getPrototypeOf(SakDao).apply(this, arguments));
  }

  _createClass(SakDao, [{
    key: "getNyheter",
    value: function getNyheter(callback) {
      _get(_getPrototypeOf(SakDao.prototype), "query", this).call(this, "select sak_id, brukernavn, overskrift, innhold, tidspunkt, bilde, kategori, viktighet from sak order by sak_id desc limit 100", [], callback);
    }
  }, {
    key: "getNyhet",
    value: function getNyhet(id, callback) {
      _get(_getPrototypeOf(SakDao.prototype), "query", this).call(this, "select sak_id, brukernavn, overskrift, innhold, tidspunkt, bilde, kategori, viktighet from sak where sak_id = ?", [id], callback);
    }
  }, {
    key: "getBrukernavnAvSak_id",
    value: function getBrukernavnAvSak_id(id, callback) {
      _get(_getPrototypeOf(SakDao.prototype), "query", this).call(this, "select brukernavn from sak WHERE sak_id = ?", [id], callback);
    }
  }, {
    key: "getUviktigeNyheter",
    value: function getUviktigeNyheter(callback) {
      _get(_getPrototypeOf(SakDao.prototype), "query", this).call(this, "select sak_id, brukernavn, overskrift, innhold, tidspunkt, bilde, kategori, viktighet from sak WHERE viktighet = 0 order by sak_id desc limit 100", [], callback);
    }
  }, {
    key: "lagNyhet",
    value: function lagNyhet(json, callback) {
      var val = [json.brukernavn, json.overskrift, json.innhold, json.tidspunkt, json.bilde, json.kategori, json.viktighet];

      _get(_getPrototypeOf(SakDao.prototype), "query", this).call(this, "insert into sak(sak_id, brukernavn, overskrift, innhold, tidspunkt, bilde, kategori, viktighet) values (DEFAULT, ?, ?, ?, ?, ?, ?, ?)", val, callback);
    }
  }, {
    key: "deleteNyhet",
    value: function deleteNyhet(json, callback) {
      var val = [json.sak_id];

      _get(_getPrototypeOf(SakDao.prototype), "query", this).call(this, "DELETE FROM sak where sak_id = ?", val, callback);
    }
  }, {
    key: "oppdaterNyhet",
    value: function oppdaterNyhet(json, id, callback) {
      var val = [json.overskrift, json.innhold, json.tidspunkt, json.bilde, json.kategori, json.viktighet, id.toString()];

      _get(_getPrototypeOf(SakDao.prototype), "query", this).call(this, "Update sak SET overskrift = ?, innhold = ?, tidspunkt = ?, bilde = ?, kategori = ?, viktighet= ? WHERE sak_id = ?", val, callback);
    }
  }]);

  return SakDao;
}(Dao);