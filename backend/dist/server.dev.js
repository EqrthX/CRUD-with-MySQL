"use strict";

var _cookieParser = _interopRequireDefault(require("cookie-parser"));

var _express = _interopRequireDefault(require("express"));

var _userRoute = _interopRequireDefault(require("./Routes/user.route.js"));

var _seq = _interopRequireDefault(require("./seq.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _express["default"])();
app.use((0, _cookieParser["default"])());
app.use(_express["default"].json());
app.use('/auth/api/users/', _userRoute["default"]);

_seq["default"].authenticate().then(function () {
  app.listen(3523, function () {
    return console.log('Server running ...');
  });
  console.log('Connection has been established successfully.');
})["catch"](function (err) {
  console.error('Unable to connect to the database: ', err);
});