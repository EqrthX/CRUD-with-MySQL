"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _sequelize = require("sequelize");

var _dotenv = require("dotenv");

(0, _dotenv.config)();
var sequelize = new _sequelize.Sequelize({
  database: process.env.DATABASE,
  username: process.env.USER,
  password: process.env.PASSWORD,
  host: process.env.HOST,
  port: process.env.PORT,
  dialect: 'mysql'
});
var _default = sequelize;
exports["default"] = _default;