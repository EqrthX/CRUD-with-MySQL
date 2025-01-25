"use strict";

var _sequelize = require("sequelize");

var _seq = _interopRequireDefault(require("../seq"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Product = _seq["default"].define('products', {
  id: {
    type: _sequelize.DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  product_name: {
    type: _sequelize.DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: _sequelize.DataTypes.DOUBLE,
    allowNull: false
  },
  quantity: {
    type: _sequelize.DataTypes.INTEGER,
    allowNull: false
  },
  Date_of_addProduct: {
    type: _sequelize.DataTypes.DATE,
    allowNull: false
  },
  Description: {
    type: _sequelize.DataTypes.TEXT,
    allowNull: false
  },
  category: {
    type: _sequelize.DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: _sequelize.DataTypes.ENUM('available', 'out_of_stock', 'discontinued'),
    defaultValue: 'available'
  },
  created_by: {
    type: _sequelize.DataTypes.INTEGER,
    allowNull: true
  },
  update_by: {
    type: _sequelize.DataTypes.INTEGER,
    allowNull: true
  }
}, {
  timestamps: true
});

_seq["default"].sync({
  force: false
}).then(function () {
  return console.log('Table products created!');
})["catch"](function (err) {
  return console.log('Creted table products error ...');
});