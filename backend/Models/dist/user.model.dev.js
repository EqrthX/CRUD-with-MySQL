"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _sequelize = require("sequelize");

var _seq = _interopRequireDefault(require("../seq.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var User = _seq["default"].define("users", {
  id: {
    type: _sequelize.DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  studentId: {
    type: _sequelize.DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  first_name: {
    type: _sequelize.DataTypes.STRING,
    allowNull: false
  },
  last_name: {
    type: _sequelize.DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: _sequelize.DataTypes.STRING,
    allowNull: false
  },
  studentYears: {
    type: _sequelize.DataTypes.SMALLINT,
    allowNull: false
  },
  lastLogin: {
    type: _sequelize.DataTypes.DATE,
    defaultValue: _sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
  },
  userType: {
    type: _sequelize.DataTypes.TEXT,
    defaultValue: "user"
  }
}, {
  timestamps: true
});

_seq["default"].sync({
  force: false
}).then(function () {
  return console.log('Table users created!');
})["catch"](function (err) {
  return console.log('Created table error: ', err);
});

var _default = User;
exports["default"] = _default;