'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

require('@babel/polyfill');
var AWS = require('aws-sdk');
var uuid = require('uuid');
var crypto = require('crypto');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var AWS__default = /*#__PURE__*/_interopDefaultLegacy(AWS);

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _construct(Parent, args, Class) {
  if (_isNativeReflectConstruct()) {
    _construct = Reflect.construct;
  } else {
    _construct = function _construct(Parent, args, Class) {
      var a = [null];
      a.push.apply(a, args);
      var Constructor = Function.bind.apply(Parent, a);
      var instance = new Constructor();
      if (Class) _setPrototypeOf(instance, Class.prototype);
      return instance;
    };
  }

  return _construct.apply(null, arguments);
}

function _isNativeFunction(fn) {
  return Function.toString.call(fn).indexOf("[native code]") !== -1;
}

function _wrapNativeSuper(Class) {
  var _cache = typeof Map === "function" ? new Map() : undefined;

  _wrapNativeSuper = function _wrapNativeSuper(Class) {
    if (Class === null || !_isNativeFunction(Class)) return Class;

    if (typeof Class !== "function") {
      throw new TypeError("Super expression must either be null or a function");
    }

    if (typeof _cache !== "undefined") {
      if (_cache.has(Class)) return _cache.get(Class);

      _cache.set(Class, Wrapper);
    }

    function Wrapper() {
      return _construct(Class, arguments, _getPrototypeOf(this).constructor);
    }

    Wrapper.prototype = Object.create(Class.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    return _setPrototypeOf(Wrapper, Class);
  };

  return _wrapNativeSuper(Class);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();

  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
        result;

    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;

      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }

    return _possibleConstructorReturn(this, result);
  };
}

function generateSecureToken() {
  return _generateSecureToken.apply(this, arguments);
}

function _generateSecureToken() {
  _generateSecureToken = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var randomBytesData, base64UrlSafe;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return new Promise(function (resolve) {
              return crypto.randomBytes(32, function (err, buffer) {
                return resolve(buffer);
              });
            });

          case 2:
            randomBytesData = _context.sent;
            base64UrlSafe = randomBytesData.toString("base64").replace(/\//g, "_").replace(/\+/g, "-");
            return _context.abrupt("return", base64UrlSafe);

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _generateSecureToken.apply(this, arguments);
}

function generateHumanReadableRandomCode() {
  return _generateHumanReadableRandomCode.apply(this, arguments);
} // // Test
// const test = async () => {
//     const code = await generateHumanReadableRandomCode(8);
//     console.log(`code`, { code });
// };
// test();

function _generateHumanReadableRandomCode() {
  _generateHumanReadableRandomCode = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var digits,
        randomBytesData,
        base64UrlSafe,
        code,
        _args2 = arguments;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            digits = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : 8;
            _context2.next = 3;
            return new Promise(function (resolve) {
              return crypto.randomBytes(digits * 3, function (err, buffer) {
                return resolve(buffer);
              });
            });

          case 3:
            randomBytesData = _context2.sent;
            base64UrlSafe = randomBytesData.toString("base64").replace(/\//g, "_").replace(/\+/g, "-").replace(/[a-z]/g, function (x) {
              return x.toUpperCase();
            }).replace(/[0Oo]/g, "Z").replace(/[5Ss]/g, "S").replace(/[1Ll]/g, "L").replace(/\d/g, "N").replace(/[^A-Z]/g, "");
            code = base64UrlSafe.substr(0, digits);
            return _context2.abrupt("return", code);

          case 7:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _generateHumanReadableRandomCode.apply(this, arguments);
}

var ApiError = /*#__PURE__*/function (_Error2) {
  _inherits(ApiError, _Error2);

  var _super2 = _createSuper(ApiError);

  function ApiError(message, data) {
    var _this2;

    _classCallCheck(this, ApiError);

    _this2 = _super2.call(this);
    _this2.message = message;
    _this2.data = data;
    return _this2;
  }

  return ApiError;
}( /*#__PURE__*/_wrapNativeSuper(Error));

var s3 = new AWS__default['default'].S3({
  signatureVersion: "v4"
});
var createPresignedUploadUrl = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(relativePath, contentType, settings, options) {
    var _options$existingSecr, _options$useTempBucke;

    var bucket, putUrl, getUrl, secretKey, result;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            bucket = options !== null && options !== void 0 && options.useTempBucket ? settings.tempBucket : settings.bucket;
            console.log("createPresignedUploadUrl - create putUrl");
            _context.next = 4;
            return s3.getSignedUrlPromise("putObject", {
              Bucket: bucket,
              // bucket path
              Key: relativePath,
              // Expire Upload Url in N secs
              // Max Time is 7 days
              Expires: 7 * 24 * 60 * 60,
              // Don't calculate signature
              // ContentMD5: false,
              // MIME Type:
              ContentType: contentType // Not supported - must be set with header on upload
              // ACL: 'public-read',

            });

          case 4:
            putUrl = _context.sent;
            getUrl = "https://".concat(bucket, ".s3.amazonaws.com/").concat(relativePath); // Save a secretKey

            console.log("createPresignedUploadUrl - save secretKey in keyBucket");

            if (!((_options$existingSecr = options === null || options === void 0 ? void 0 : options.existingSecretKey) !== null && _options$existingSecr !== void 0)) {
              _context.next = 11;
              break;
            }

            _context.t0 = _options$existingSecr;
            _context.next = 14;
            break;

          case 11:
            _context.next = 13;
            return generateSecureToken();

          case 13:
            _context.t0 = _context.sent;

          case 14:
            secretKey = _context.t0;
            _context.next = 17;
            return new Promise(function (resolve, reject) {
              s3.upload({
                Bucket: settings.keyBucket,
                Key: "".concat(relativePath, "-key"),
                Body: secretKey
              }, {}, function (err, result) {
                if (err) {
                  reject(err);
                  return;
                }

                resolve(result);
              });
            });

          case 17:
            result = {
              putUrl: putUrl,
              getUrl: getUrl,
              relativePath: relativePath,
              expirationTimestamp: Date.now() + 7 * 24 * 60 * 60 * 1000,
              contentType: contentType,
              secretKey: secretKey,
              isTemporaryObject: (_options$useTempBucke = options === null || options === void 0 ? void 0 : options.useTempBucket) !== null && _options$useTempBucke !== void 0 ? _options$useTempBucke : false
            };
            return _context.abrupt("return", {
              uploadUrl: result
            });

          case 19:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function createPresignedUploadUrl(_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
}();
var createPresignedUploadUrl_random = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(contentType, settings, options) {
    var relPath;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.t0 = "".concat(options !== null && options !== void 0 && options.prefix ? "".concat(options.prefix, "/") : "");

            if (!(options !== null && options !== void 0 && options.shareablePath)) {
              _context2.next = 7;
              break;
            }

            _context2.next = 4;
            return generateHumanReadableRandomCode();

          case 4:
            _context2.t1 = _context2.sent;
            _context2.next = 8;
            break;

          case 7:
            _context2.t1 = uuid.v4();

          case 8:
            _context2.t2 = _context2.t1;
            relPath = _context2.t0.concat.call(_context2.t0, _context2.t2);
            _context2.next = 12;
            return createPresignedUploadUrl(relPath, contentType, settings, {
              useTempBucket: options === null || options === void 0 ? void 0 : options.shareablePath
            });

          case 12:
            return _context2.abrupt("return", _context2.sent);

          case 13:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function createPresignedUploadUrl_random(_x5, _x6, _x7) {
    return _ref2.apply(this, arguments);
  };
}();
var createUploadApi = function createUploadApi(settings) {
  var uploadApi = {
    createUploadUrl: function createUploadUrl(data) {
      var _data$contentType, _data$shareablePath;

      return createPresignedUploadUrl_random((_data$contentType = data.contentType) !== null && _data$contentType !== void 0 ? _data$contentType : "application/json", settings, {
        prefix: data.prefix,
        shareablePath: (_data$shareablePath = data.shareablePath) !== null && _data$shareablePath !== void 0 ? _data$shareablePath : false
      });
    },
    renewUploadUrl: function () {
      var _renewUploadUrl = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(data) {
        var secretKeyResult;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                // Verify Key
                console.log("renewUploadUrl - verify secretKey"); // data.uploadUrl.secretKey;

                _context3.next = 3;
                return new Promise(function (resolve, reject) {
                  s3.getObject({
                    Bucket: settings.keyBucket,
                    Key: "".concat(data.uploadUrl.relativePath, "-key")
                  }, function (err, result) {
                    if (err) {
                      reject(err);
                      return;
                    }

                    resolve("".concat(result.Body));
                  });
                });

              case 3:
                secretKeyResult = _context3.sent;

                if (!(secretKeyResult !== data.uploadUrl.secretKey)) {
                  _context3.next = 6;
                  break;
                }

                throw new ApiError("Invalid Secret Key");

              case 6:
                console.log("renewUploadUrl - create new url");
                _context3.next = 9;
                return createPresignedUploadUrl(data.uploadUrl.relativePath, data.uploadUrl.contentType, settings, {
                  existingSecretKey: data.uploadUrl.secretKey
                });

              case 9:
                return _context3.abrupt("return", _context3.sent);

              case 10:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      function renewUploadUrl(_x8) {
        return _renewUploadUrl.apply(this, arguments);
      }

      return renewUploadUrl;
    }()
  };
  return uploadApi;
};

var settings = {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  bucket: process.env.BUCKET,
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  keyBucket: process.env.KEYBUCKET,
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  tempBucket: process.env.TEMPBUCKET
};
var handleUploadApiWebRequest = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(requestData) {
    var endpoint, data, appApi, result, response;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            endpoint = requestData.endpoint, data = requestData.data; // Execute Request

            appApi = createUploadApi(settings); // eslint-disable-next-line @typescript-eslint/no-explicit-any

            _context.next = 4;
            return appApi[endpoint](data);

          case 4:
            result = _context.sent;
            response = {
              data: result
            };
            return _context.abrupt("return", response);

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function handleUploadApiWebRequest(_x) {
    return _ref.apply(this, arguments);
  };
}();

var corsHeaders = {
  'Access-Control-Allow-Origin': "*",
  'Access-Control-Allow-Credentials': true
};

var handler = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(event) {
    var _event$body, _event$body2, data, result;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            console.log("handler START");
            console.log("event.body ".concat((_event$body = event === null || event === void 0 ? void 0 : event.body) !== null && _event$body !== void 0 ? _event$body : "null"));
            data = JSON.parse((_event$body2 = event === null || event === void 0 ? void 0 : event.body) !== null && _event$body2 !== void 0 ? _event$body2 : "{}");
            _context.next = 6;
            return handleUploadApiWebRequest(data);

          case 6:
            result = _context.sent;
            return _context.abrupt("return", {
              statusCode: 200,
              headers: corsHeaders,
              body: JSON.stringify(result)
            });

          case 10:
            _context.prev = 10;
            _context.t0 = _context["catch"](0);
            console.error("Request FAILED", {
              err: _context.t0
            });
            return _context.abrupt("return", {
              statusCode: 500,
              headers: corsHeaders,
              body: JSON.stringify({
                message: "Server Error",
                error: _context.t0
              })
            });

          case 14:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 10]]);
  }));

  return function handler(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.handler = handler;
