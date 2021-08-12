'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

require('@babel/polyfill');
var AWS = require('aws-sdk');

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

var parseTokenId_art121 = function parseTokenId_art121(tokenId) {
  var tokenTimestampValue = Number.parseInt(tokenId.substr(0, tokenId.length - 6), 10);
  var tokenCounterValue = Number.parseInt(tokenId.substr(tokenId.length - 6), 10);
  console.log("parseTokenId_art121", {
    tokenId: tokenId,
    tokenTimestampValue: tokenTimestampValue,
    tokenCounterValue: tokenCounterValue
  });

  if (!Number.isFinite(tokenTimestampValue)) {
    return null;
  }

  if (!Number.isFinite(tokenCounterValue)) {
    return null;
  }

  var tokenCounter = tokenCounterValue;
  var timestampSecs = tokenTimestampValue;
  var targetSecs = Math.floor(new Date("2021-01-21 21:21:21Z").getTime()) / 1000;
  var timeDeltaSecs = Math.abs(targetSecs - timestampSecs);
  return {
    tokenId: tokenId,
    tokenCounter: tokenCounter,
    timestampSecs: timestampSecs,
    targetSecs: targetSecs,
    timeDeltaSecs: timeDeltaSecs
  };
};

var generateNftMetadata_art121 = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref) {
    var params, tokenId, _ref3;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            params = _ref.params;

            if (!(params.type === "contract")) {
              _context.next = 3;
              break;
            }

            return _context.abrupt("return", {
              name: "1/21/21 21:21:21 Art Sell",
              description: "This exact time pattern will occur only once in our human timeline. This NFT crypto art will attempt to capture that time to the precise second and embed it in the distributed blockchain forever.",
              image: "https://ricklove.me/blog-content/posts/2021-01-21-crypto-art-121/art-121.png",
              external_link: "https://ricklove.me/art?artwork=art-121"
            });

          case 3:
            if (!(params.type === "factory")) {
              _context.next = 5;
              break;
            }

            return _context.abrupt("return", {
              name: "1/21/21 21:21:21 Art Sell",
              description: "This exact time pattern will occur only once in our human timeline. This NFT crypto art will attempt to capture that time to the precise second and embed it in the distributed blockchain forever.",
              image: "https://ricklove.me/blog-content/posts/2021-01-21-crypto-art-121/art-121.png",
              external_link: "https://ricklove.me/art?artwork=art-121"
            });

          case 5:
            // Artwork

            /*
            {
            "attributes": [
              {
                "trait_type": "Base",
                "value": "starfish"
              },
              {
                "trait_type": "Eyes",
                "value": "joy"
              },
              {
                "trait_type": "Mouth",
                "value": "surprised"
              },
              {
                "trait_type": "Level",
                "value": 2
              },
              {
                "trait_type": "Stamina",
                "value": 2.3
              },
              {
                "trait_type": "Personality",
                "value": "Sad"
              },
              {
                "display_type": "boost_number",
                "trait_type": "Aqua Power",
                "value": 40
              },
              {
                "display_type": "boost_percentage",
                "trait_type": "Stamina Increase",
                "value": 10
              },
              {
                "display_type": "number",
                "trait_type": "Generation",
                "value": 2
              }
            ],
            "description": "Friendly OpenSea Creature that enjoys long swims in the ocean.",
            "external_url": "https://openseacreatures.io/1",
            "image": "https://storage.googleapis.com/opensea-prod.appspot.com/creature/1.png",
            "name": "Sprinkles Fisherton"
            }
            */
            tokenId = params.tokenId || "";
            _ref3 = parseTokenId_art121(tokenId) || {
              tokenCounter: -1,
              timestampSecs: 0,
              targetSecs: 0,
              timeDeltaSecs: 1000000000,
              tokenId: -1
            }, _ref3.tokenCounter, _ref3.timestampSecs, _ref3.targetSecs, _ref3.timeDeltaSecs; // TODO: Generate image using:
            // https://www.npmjs.com/package/node-p5
            // and save to bucket
            // TODO: Check if image already exists in image bucket
            //
            // TESTING - return art cats metadata

            return _context.abrupt("return", {
              "platform": "Art Blocks Factory",
              "name": "CatBlocks #362",
              "curation_status": "factory",
              "series": "N/A",
              "description": "TESTING - NOT REAL NFT! Adorable and purrfect, these carefully bred kitties express a wide range of emotions and personalities. They live entirely on-chain and they just love receiving pets. Additional project feature(s) => Breed: Tabby, Color: Ginger, Body Pattern: 3, Face Pattern: 7, Eye Color: Yellow, Head: Cheeky, Ears: Floppy, Eyes: Doe, Pupils: Normal, Mouth: Pouting",
              "external_url": "https://www.artblocks.io/token/73000362",
              "artist": "Kristy Glas",
              "royaltyInfo": {
                "artistAddress": "0x0EB47BEabd9CE2cab7CbED57aA6B040975BDc1b7",
                "additionalPayee": "0x0000000000000000000000000000000000000000",
                "additionalPayeePercentage": "0",
                "royaltyFeeByID": "10"
              },
              "collection_name": "CatBlocks by Kristy Glas",
              "traits": [{
                "trait_type": "CatBlocks",
                "value": "All CatBlocks"
              }, {
                "trait_type": "CatBlocks",
                "value": "Breed: Tabby"
              }, {
                "trait_type": "CatBlocks",
                "value": "Color: Ginger"
              }, {
                "trait_type": "CatBlocks",
                "value": "Body Pattern: 3"
              }, {
                "trait_type": "CatBlocks",
                "value": "Face Pattern: 7"
              }, {
                "trait_type": "CatBlocks",
                "value": "Eye Color: Yellow"
              }, {
                "trait_type": "CatBlocks",
                "value": "Head: Cheeky"
              }, {
                "trait_type": "CatBlocks",
                "value": "Ears: Floppy"
              }, {
                "trait_type": "CatBlocks",
                "value": "Eyes: Doe"
              }, {
                "trait_type": "CatBlocks",
                "value": "Pupils: Normal"
              }, {
                "trait_type": "CatBlocks",
                "value": "Mouth: Pouting"
              }],
              "payout_address": "0x6C093Fe8bc59e1e0cAe2Ec10F0B717D3D182056B",
              "features": ["Breed: Tabby", "Color: Ginger", "Body Pattern: 3", "Face Pattern: 7", "Eye Color: Yellow", "Head: Cheeky", "Ears: Floppy", "Eyes: Doe", "Pupils: Normal", "Mouth: Pouting"],
              "website": "https://www.kristyglas.com/",
              "is dynamic": true,
              "script type": "p5js",
              "aspect ratio (w/h)": "1",
              "uses hash": true,
              "tokenID": "73000362",
              "token hash": "0x820969f356d934272722976f870d6743fc90938275e1c93866a2e025565fa71f",
              "license": "NIFTY",
              "animation_url": "https://generator.artblocks.io/73000362",
              "image": "https://api.artblocks.io/image/73000362",
              "interactive_nft": {
                "code_uri": "https://generator.artblocks.io/73000362",
                "version": "0.0.9"
              }
            });

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function generateNftMetadata_art121(_x) {
    return _ref2.apply(this, arguments);
  };
}();

var s3 = new AWS__default['default'].S3({
  signatureVersion: "v4"
});
var createNftApi = function createNftApi(settings) {
  var api = {
    generateNftMetadata: function () {
      var _generateNftMetadata = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref) {
        var path, params;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                path = _ref.path, params = _ref.params;

                if (!path.includes("art-121")) {
                  _context.next = 5;
                  break;
                }

                _context.next = 4;
                return generateNftMetadata_art121({
                  params: params
                });

              case 4:
                return _context.abrupt("return", _context.sent);

              case 5:
                throw new ApiError("Unknown Artwork", {
                  path: path,
                  params: params
                });

              case 6:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function generateNftMetadata(_x) {
        return _generateNftMetadata.apply(this, arguments);
      }

      return generateNftMetadata;
    }()
  };
  return api;
};

var handleNftApiWebRequest = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(requestData) {
    var path, params, nftApi, result;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            path = requestData.path, params = requestData.params;
            nftApi = createNftApi();
            _context.next = 4;
            return nftApi.generateNftMetadata({
              path: path,
              params: params
            });

          case 4:
            result = _context.sent;
            return _context.abrupt("return", result);

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function handleNftApiWebRequest(_x) {
    return _ref.apply(this, arguments);
  };
}();

var corsHeaders = {
  'Access-Control-Allow-Origin': "*",
  'Access-Control-Allow-Credentials': true
};

var handler = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(event) {
    var _event$queryStringPar, result;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            console.log("handler START"); // console.log(`event.body ${event?.body ?? `null`}`);
            // const data = JSON.parse(event?.body ?? `{}`);

            _context.next = 4;
            return handleNftApiWebRequest({
              path: event.path,
              params: (_event$queryStringPar = event.queryStringParameters) !== null && _event$queryStringPar !== void 0 ? _event$queryStringPar : {}
            });

          case 4:
            result = _context.sent;
            return _context.abrupt("return", {
              statusCode: 200,
              headers: corsHeaders,
              body: JSON.stringify(result)
            });

          case 8:
            _context.prev = 8;
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

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 8]]);
  }));

  return function handler(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.handler = handler;
