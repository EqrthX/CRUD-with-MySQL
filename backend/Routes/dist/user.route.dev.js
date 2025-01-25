"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _userModel = _interopRequireDefault(require("../Models/user.model.js"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _expressValidator = require("express-validator");

var _sequelize = require("sequelize");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_dotenv["default"].config();

var userRoter = _express["default"].Router();

var verifyToken = function verifyToken(req, res, next) {
  var token = req.headers['authorization'] || req.headers['Authorization'];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: No token provided"
    });
  }

  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }

  _jsonwebtoken["default"].verify(token, process.env.JWT_SECRET, function (err, decoded) {
    if (err) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Token is invalid"
      });
    }

    req.user = decoded;
    next();
  });
};

userRoter.get('/', function (req, res) {
  res.send('Hello World!');
});
userRoter.post('/signup', [(0, _expressValidator.body)('studentId').notEmpty().withMessage('Student ID is required').isNumeric().withMessage('Student ID is a number'), (0, _expressValidator.body)('fname').notEmpty().withMessage('First name is required').isAlpha().withMessage('First name must contain only letter'), (0, _expressValidator.body)('lname').notEmpty().withMessage('Last name is required').isAlpha().withMessage('Last name must contain only letter'), (0, _expressValidator.body)('password').notEmpty().withMessage('Password is required').isLength({
  min: 6
}).withMessage('Password must be at least 6 characters long'), (0, _expressValidator.body)('studentYears').notEmpty().withMessage('Student Years is required').isInt({
  min: 1,
  max: 4
}).withMessage('Student years must be between 1 and 4')], function _callee(req, res) {
  var errors, _req$body, studentId, fname, lname, password, studentYears, exitsStudentId, hashPassword, user;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          errors = ValidationResult(req);

          if (errors.isEmpty()) {
            _context.next = 3;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            success: false,
            error: errors.array()
          }));

        case 3:
          _context.prev = 3;
          _req$body = req.body, studentId = _req$body.studentId, fname = _req$body.fname, lname = _req$body.lname, password = _req$body.password, studentYears = _req$body.studentYears;
          _context.next = 7;
          return regeneratorRuntime.awrap(_userModel["default"].findOne({
            where: {
              studentId: studentId
            }
          }));

        case 7:
          exitsStudentId = _context.sent;

          if (!exitsStudentId) {
            _context.next = 10;
            break;
          }

          return _context.abrupt("return", res.status(200).json({
            success: false,
            message: "Student Id is Already."
          }));

        case 10:
          _context.next = 12;
          return regeneratorRuntime.awrap(_bcrypt["default"].hash(password, 10));

        case 12:
          hashPassword = _context.sent;

          if (hashPassword) {
            _context.next = 15;
            break;
          }

          return _context.abrupt("return", res.status(404).json({
            success: false,
            message: "Hash password no complete"
          }));

        case 15:
          _context.next = 17;
          return regeneratorRuntime.awrap(_userModel["default"].create({
            studentId: studentId,
            first_name: fname,
            last_name: lname,
            password: hashPassword,
            studentYears: studentYears
          }));

        case 17:
          user = _context.sent;

          if (user) {
            _context.next = 20;
            break;
          }

          return _context.abrupt("return", res.status(404).json({
            success: false,
            message: "Creted user failed!"
          }));

        case 20:
          return _context.abrupt("return", res.status(201).json({
            success: true,
            user: user
          }));

        case 23:
          _context.prev = 23;
          _context.t0 = _context["catch"](3);
          console.log('Somethings wrong!: ', _context.t0);
          return _context.abrupt("return", res.status(500).json({
            success: false,
            message: "Server Error"
          }));

        case 27:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[3, 23]]);
});
userRoter.post('/login', [(0, _expressValidator.body)('studentId').notEmpty().withMessage('Student ID is required'), (0, _expressValidator.body)('password').notEmpty().withMessage('Password is required')], function _callee2(req, res) {
  var errors, _req$body2, studentId, password, findStudentId, checkPassword, token;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          errors = ValidationResult(req);

          if (errors.isEmpty()) {
            _context2.next = 3;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            success: false,
            error: errors.array()
          }));

        case 3:
          _context2.prev = 3;
          _req$body2 = req.body, studentId = _req$body2.studentId, password = _req$body2.password;

          if (!(!studentId || !password)) {
            _context2.next = 7;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            success: false,
            message: "All fields are required!"
          }));

        case 7:
          _context2.next = 9;
          return regeneratorRuntime.awrap(_userModel["default"].findOne({
            where: {
              studentId: studentId
            }
          }));

        case 9:
          findStudentId = _context2.sent;

          if (findStudentId) {
            _context2.next = 12;
            break;
          }

          return _context2.abrupt("return", res.status(404).json({
            success: false,
            message: "Student ID not found, Please sign up first"
          }));

        case 12:
          _context2.next = 14;
          return regeneratorRuntime.awrap(_bcrypt["default"].compare(password, findStudentId.password));

        case 14:
          checkPassword = _context2.sent;

          if (checkPassword) {
            _context2.next = 17;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            success: false,
            message: "Password not correct"
          }));

        case 17:
          token = _jsonwebtoken["default"].sign({
            userId: findStudentId.id,
            studentId: findStudentId.studentId,
            firstname: findStudentId.first_name
          }, process.env.JWT_SECRET, {
            expiresIn: '1h'
          });
          res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3600000
          });
          return _context2.abrupt("return", res.status(200).json({
            success: true,
            message: "Login successfully!",
            token: token
          }));

        case 22:
          _context2.prev = 22;
          _context2.t0 = _context2["catch"](3);
          console.log('Something wrong!');
          return _context2.abrupt("return", res.status(500).json({
            success: false,
            message: "Server Error"
          }));

        case 26:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[3, 22]]);
});
userRoter.get('/homepage', verifyToken, function _callee3(req, res) {
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          res.json({
            message: "Access token ready to use website"
          });

        case 1:
        case "end":
          return _context3.stop();
      }
    }
  });
});
userRoter.post('/update-profile', [(0, _expressValidator.body)('userId').notEmpty().isInt().withMessage('User ID not found'), (0, _expressValidator.body)('first_name').notEmpty().withMessage('Firstn Name is required for update profile').isAlpha().withMessage('First name must be contain only letter'), (0, _expressValidator.body)('last_name').notEmpty().withMessage('Last Name is required for update profile').isAlpha().withMessage('Last name must be contain only letter')], verifyToken, function _callee4(req, res) {
  var errors, _req$body3, userId, first_name, last_name, user;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          errors = ValidationResult(req);

          if (errors.isEmpty()) {
            _context4.next = 3;
            break;
          }

          return _context4.abrupt("return", res.status(400).json({
            success: false,
            error: errors.array()
          }));

        case 3:
          _context4.prev = 3;
          _req$body3 = req.body, userId = _req$body3.userId, first_name = _req$body3.first_name, last_name = _req$body3.last_name;
          _context4.next = 7;
          return regeneratorRuntime.awrap(_userModel["default"].findByPk(userId));

        case 7:
          user = _context4.sent;

          if (user) {
            _context4.next = 10;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            success: false,
            message: "User not found"
          }));

        case 10:
          user.first_name = first_name;
          user.last_name = last_name;
          _context4.next = 14;
          return regeneratorRuntime.awrap(user.save());

        case 14:
          res.status(200).json({
            success: true,
            message: "Update profile successfully!"
          });
          _context4.next = 21;
          break;

        case 17:
          _context4.prev = 17;
          _context4.t0 = _context4["catch"](3);
          console.log('Something went wrong! ', _context4.t0);
          res.status(500).json({
            success: false,
            message: "Server Error"
          });

        case 21:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[3, 17]]);
});
userRoter.post('/add-product', [verifyToken, (0, _expressValidator.body)('productName').notEmpty().withMessage('Product name is required').isLength({
  min: 3
}).withMessage('Product name must be at least 3 characters'), (0, _expressValidator.body)('price').notEmpty().withMessage('Price is required').isFloat({
  min: 0
}).withMessage('Price must be a positive number'), (0, _expressValidator.body)('quantity').notEmpty().withMessage('Price is required').isLength({
  min: 1
}).withMessage('Price must be at least 1'), (0, _expressValidator.body)('date_of_addProduct').notEmpty().withMessage('Date is required').isISO8601({
  min: 0
}).withMessage('Date must be a valid format (YYYY-MM-DD)'), (0, _expressValidator.body)('description').notEmpty().withMessage('Description is required'), (0, _expressValidator.body)('category').notEmpty().withMessage('Category is required'), (0, _expressValidator.body)('status').notEmpty().withMessage('Status is required')], function (req, res) {
  var errors = ValidationResult(req);

  if (!errors) {
    return res.status(400).json({
      success: false,
      error: errors.array()
    });
  }

  try {
    var _req$body4 = req.body,
        productName = _req$body4.productName,
        price = _req$body4.price,
        quantity = _req$body4.quantity,
        date_of_addProduct = _req$body4.date_of_addProduct,
        description = _req$body4.description,
        category = _req$body4.category,
        status = _req$body4.status,
        create_by = _req$body4.create_by,
        update_by = _req$body4.update_by;
  } catch (error) {}
});
userRoter.post('/logout', verifyToken, function _callee5(req, res) {
  var userId, timestamp, date, options, thaiDate, user;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          userId = req.body.userId;
          timestamp = Date.now();
          date = new Date(timestamp);
          options = {
            timeZone: 'Asia/Bangkok',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            second: '2-digit'
          };
          thaiDate = new Intl.DateTimeFormat('th-TH', options).format(date);
          _context5.next = 8;
          return regeneratorRuntime.awrap(_userModel["default"].findByPk(userId));

        case 8:
          user = _context5.sent;
          user.lastLogin = thaiDate;
          _context5.next = 12;
          return regeneratorRuntime.awrap(user.save());

        case 12:
          res.clearCookie('token');
          return _context5.abrupt("return", res.status(200).json({
            success: true,
            message: "Log out successfully"
          }));

        case 16:
          _context5.prev = 16;
          _context5.t0 = _context5["catch"](0);

        case 18:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 16]]);
});
var _default = userRoter;
exports["default"] = _default;