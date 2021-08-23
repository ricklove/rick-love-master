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

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _createForOfIteratorHelper(o, allowArrayLike) {
  var it;

  if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;

      var F = function () {};

      return {
        s: F,
        n: function () {
          if (i >= o.length) return {
            done: true
          };
          return {
            done: false,
            value: o[i++]
          };
        },
        e: function (e) {
          throw e;
        },
        f: F
      };
    }

    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var normalCompletion = true,
      didErr = false,
      err;
  return {
    s: function () {
      it = o[Symbol.iterator]();
    },
    n: function () {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function (e) {
      didErr = true;
      err = e;
    },
    f: function () {
      try {
        if (!normalCompletion && it.return != null) it.return();
      } finally {
        if (didErr) throw err;
      }
    }
  };
}

var toKeyValueObject = function toKeyValueObject(items) {
  var v = {};
  items.forEach(function (x) {
    v[x.key] = x.value;
  });
  return v;
};

var shuffle = function shuffle(items) {
  return items.map(function (x) {
    return {
      x: x,
      value: Math.random()
    };
  }).sort(function (a, b) {
    return a.value - b.value;
  }).map(function (x) {
    return x.x;
  });
};

var doodleStoragePaths = {
  doodleSummary: "doodle/summary",
  doodleDrawingsPrefix: "doodle/drawings",
  doodlePartyDrawingsPrefix: "doodle/party/drawings",
  doodleVotesPrefix: "doodle/votes"
};

var s3 = new AWS__default['default'].S3({
  signatureVersion: "v4"
});
var settings = {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  bucket: process.env.BUCKET,
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  serverStateBucket: process.env.SERVERSTATEBUCKET
};

var getObjectJsonData = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(bucket, key) {
    var _result$Body, result;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return s3.getObject({
              Bucket: bucket,
              Key: key
            }).promise();

          case 3:
            result = _context.sent;

            if (result) {
              _context.next = 6;
              break;
            }

            return _context.abrupt("return", null);

          case 6:
            return _context.abrupt("return", JSON.parse("".concat((_result$Body = result.Body) !== null && _result$Body !== void 0 ? _result$Body : "NULL!{}")));

          case 9:
            _context.prev = 9;
            _context.t0 = _context["catch"](0);
            return _context.abrupt("return", null);

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 9]]);
  }));

  return function getObjectJsonData(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var setObjectJsonData = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(bucket, key, value) {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return s3.putObject({
              Bucket: bucket,
              Key: key,
              Body: JSON.stringify(value) // ContentType: `application/json`,

            }).promise();

          case 2:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function setObjectJsonData(_x3, _x4, _x5) {
    return _ref2.apply(this, arguments);
  };
}();

var processAllObjects = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(bucket, prefix, shouldProcess, processItem) {
    var results, processResults;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            console.log("processAllObjects - listObjectsV2");
            _context5.next = 3;
            return s3.listObjectsV2({
              Bucket: bucket,
              Prefix: prefix
            }).promise();

          case 3:
            results = _context5.sent;

            processResults = /*#__PURE__*/function () {
              var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
                var _results$Contents, _results$Contents$map, _results$Contents2;

                var itemInfos, itemsToProcess;
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                  while (1) {
                    switch (_context4.prev = _context4.next) {
                      case 0:
                        console.log("processAllObjects.processResults", {
                          bucket: bucket,
                          prefix: prefix,
                          length: (_results$Contents = results.Contents) === null || _results$Contents === void 0 ? void 0 : _results$Contents.length,
                          keyCount: results.KeyCount
                        });
                        itemInfos = (_results$Contents$map = (_results$Contents2 = results.Contents) === null || _results$Contents2 === void 0 ? void 0 : _results$Contents2.map(function (x) {
                          var _x$Key, _x$LastModified$getTi, _x$LastModified;

                          return {
                            key: (_x$Key = x.Key) !== null && _x$Key !== void 0 ? _x$Key : "",
                            lastModifiedTimestamp: (_x$LastModified$getTi = (_x$LastModified = x.LastModified) === null || _x$LastModified === void 0 ? void 0 : _x$LastModified.getTime()) !== null && _x$LastModified$getTi !== void 0 ? _x$LastModified$getTi : 0
                          };
                        })) !== null && _results$Contents$map !== void 0 ? _results$Contents$map : [];
                        itemsToProcess = itemInfos.filter(function (x) {
                          return shouldProcess(x);
                        });
                        _context4.next = 5;
                        return Promise.all(itemsToProcess.map( /*#__PURE__*/function () {
                          var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(x) {
                            var _x$key;

                            var obj;
                            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                              while (1) {
                                switch (_context3.prev = _context3.next) {
                                  case 0:
                                    _context3.next = 2;
                                    return getObjectJsonData(bucket, (_x$key = x.key) !== null && _x$key !== void 0 ? _x$key : "");

                                  case 2:
                                    obj = _context3.sent;

                                    if (obj) {
                                      _context3.next = 5;
                                      break;
                                    }

                                    return _context3.abrupt("return");

                                  case 5:
                                    _context3.next = 7;
                                    return processItem(obj, x);

                                  case 7:
                                  case "end":
                                    return _context3.stop();
                                }
                              }
                            }, _callee3);
                          }));

                          return function (_x10) {
                            return _ref5.apply(this, arguments);
                          };
                        }()));

                      case 5:
                      case "end":
                        return _context4.stop();
                    }
                  }
                }, _callee4);
              }));

              return function processResults() {
                return _ref4.apply(this, arguments);
              };
            }();

            _context5.next = 7;
            return processResults();

          case 7:
            if (!results.IsTruncated) {
              _context5.next = 16;
              break;
            }

            console.log("processAllObjects - listObjectsV2 (NextContinuationToken)"); // eslint-disable-next-line no-await-in-loop

            _context5.next = 11;
            return s3.listObjectsV2({
              Bucket: bucket,
              Prefix: prefix,
              ContinuationToken: results.NextContinuationToken
            }).promise();

          case 11:
            results = _context5.sent;
            _context5.next = 14;
            return processResults();

          case 14:
            _context5.next = 7;
            break;

          case 16:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function processAllObjects(_x6, _x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}();

var handleDoodleTask = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
    var _yield$getObjectJsonD;

    var runStartTimestamp, TASK_STATE_KEY, taskState, doodlePromptsSelected, doodlesIncluded, doodleKeysIncluded, doodleData, _i, _Object$keys, _bucketKey, doodleKeys, d, _iterator, _step, doodle;

    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            console.log("handleDoodleTask");
            runStartTimestamp = Date.now(); // Get Task State

            // Get Task State
            console.log("handleDoodleTask - get task state");
            TASK_STATE_KEY = "doodleTaskState";
            _context8.next = 6;
            return getObjectJsonData(settings.serverStateBucket, TASK_STATE_KEY);

          case 6:
            _context8.t1 = _yield$getObjectJsonD = _context8.sent;
            _context8.t0 = _context8.t1 !== null;

            if (!_context8.t0) {
              _context8.next = 10;
              break;
            }

            _context8.t0 = _yield$getObjectJsonD !== void 0;

          case 10:
            if (!_context8.t0) {
              _context8.next = 14;
              break;
            }

            _context8.t2 = _yield$getObjectJsonD;
            _context8.next = 15;
            break;

          case 14:
            _context8.t2 = {
              lastRunTimestamp: 0,
              doodleScores: {},
              doodlePrompts: {},
              doodleSources: {}
            };

          case 15:
            taskState = _context8.t2;
            // Update all scores from votes
            console.log("handleDoodleTask - processAllObjects - votes");
            _context8.next = 19;
            return processAllObjects(settings.bucket, "".concat(doodleStoragePaths.doodleVotesPrefix, "/"), function (x) {
              return x.lastModifiedTimestamp > taskState.lastRunTimestamp;
            }, /*#__PURE__*/function () {
              var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(jsonObj) {
                var doodleVotes;
                return regeneratorRuntime.wrap(function _callee6$(_context6) {
                  while (1) {
                    switch (_context6.prev = _context6.next) {
                      case 0:
                        doodleVotes = jsonObj.data.doodleVotes;
                        doodleVotes.forEach(function (x) {
                          var _taskState$doodleScor;

                          if (x.t <= taskState.lastRunTimestamp || x.t > runStartTimestamp) {
                            return;
                          }

                          taskState.doodleScores[x.k] = ((_taskState$doodleScor = taskState.doodleScores[x.k]) !== null && _taskState$doodleScor !== void 0 ? _taskState$doodleScor : 0) + 1;
                        });

                      case 2:
                      case "end":
                        return _context6.stop();
                    }
                  }
                }, _callee6);
              }));

              return function (_x11) {
                return _ref7.apply(this, arguments);
              };
            }());

          case 19:
            // Update doodles
            console.log("handleDoodleTask - processAllObjects - doodles");
            _context8.next = 22;
            return processAllObjects(settings.bucket, "".concat(doodleStoragePaths.doodleDrawingsPrefix, "/"), function (x) {
              return x.lastModifiedTimestamp > taskState.lastRunTimestamp;
            }, /*#__PURE__*/function () {
              var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(jsonObj, itemInfo) {
                var doodles;
                return regeneratorRuntime.wrap(function _callee7$(_context7) {
                  while (1) {
                    switch (_context7.prev = _context7.next) {
                      case 0:
                        doodles = jsonObj.data.doodles;
                        doodles.forEach(function (x) {
                          var _taskState$doodleProm, _taskState$doodleSour;

                          if (x.t <= taskState.lastRunTimestamp || x.t > runStartTimestamp) {
                            return;
                          }

                          taskState.doodleScores[x.k] = 0;
                          taskState.doodlePrompts[x.p] = (_taskState$doodleProm = taskState.doodlePrompts[x.p]) !== null && _taskState$doodleProm !== void 0 ? _taskState$doodleProm : [];
                          taskState.doodlePrompts[x.p].push(x.k);
                          taskState.doodleSources[itemInfo.key] = (_taskState$doodleSour = taskState.doodleSources[itemInfo.key]) !== null && _taskState$doodleSour !== void 0 ? _taskState$doodleSour : [];
                          taskState.doodleSources[itemInfo.key].push(x.k);
                        });

                      case 2:
                      case "end":
                        return _context7.stop();
                    }
                  }
                }, _callee7);
              }));

              return function (_x12, _x13) {
                return _ref8.apply(this, arguments);
              };
            }());

          case 22:
            // Create Summary File (choose 4 best doodles & 4 random doodles for each prompt and copy into a single file for client usage)
            console.log("handleDoodleTask - create Summary File"); // TODO: moderation, etc.

            doodlePromptsSelected = Object.keys(taskState.doodlePrompts).map(function (p) {
              var d = taskState.doodlePrompts[p].map(function (doodleKey) {
                return {
                  doodleKey: doodleKey,
                  score: taskState.doodleScores[doodleKey]
                };
              });
              d.sort(function (a, b) {
                return -(a.score - b.score);
              });
              var best = d.slice(0, 4);
              var others = shuffle(d.slice(4)).slice(0, 4);
              return {
                prompt: p,
                doodles: [].concat(_toConsumableArray(best), _toConsumableArray(others))
              };
            });
            doodlesIncluded = doodlePromptsSelected.flatMap(function (x) {
              return x.doodles;
            });
            doodleKeysIncluded = toKeyValueObject(doodlesIncluded.map(function (x) {
              return {
                key: x.doodleKey,
                value: true
              };
            })); // Combine all doodle drawings and scores

            doodleData = {
              doodles: []
            };
            _i = 0, _Object$keys = Object.keys(taskState.doodleSources);

          case 28:
            if (!(_i < _Object$keys.length)) {
              _context8.next = 59;
              break;
            }

            _bucketKey = _Object$keys[_i];
            // Skip if none includede
            doodleKeys = taskState.doodleSources[_bucketKey];

            if (doodleKeys.some(function (x) {
              return doodleKeysIncluded[x];
            })) {
              _context8.next = 33;
              break;
            }

            return _context8.abrupt("continue", 56);

          case 33:
            _context8.next = 35;
            return getObjectJsonData(settings.bucket, _bucketKey);

          case 35:
            d = _context8.sent;

            if (d) {
              _context8.next = 38;
              break;
            }

            return _context8.abrupt("continue", 56);

          case 38:
            _iterator = _createForOfIteratorHelper(d.data.doodles);
            _context8.prev = 39;

            _iterator.s();

          case 41:
            if ((_step = _iterator.n()).done) {
              _context8.next = 48;
              break;
            }

            doodle = _step.value;

            if (doodleKeysIncluded[doodle.k]) {
              _context8.next = 45;
              break;
            }

            return _context8.abrupt("continue", 46);

          case 45:
            doodleData.doodles.push(_objectSpread2(_objectSpread2({}, doodle), {}, {
              s: taskState.doodleScores[doodle.k]
            }));

          case 46:
            _context8.next = 41;
            break;

          case 48:
            _context8.next = 53;
            break;

          case 50:
            _context8.prev = 50;
            _context8.t3 = _context8["catch"](39);

            _iterator.e(_context8.t3);

          case 53:
            _context8.prev = 53;

            _iterator.f();

            return _context8.finish(53);

          case 56:
            _i++;
            _context8.next = 28;
            break;

          case 59:
            // Save doodle summary
            console.log("handleDoodleTask - save summary");
            _context8.next = 62;
            return setObjectJsonData(settings.bucket, doodleStoragePaths.doodleSummary, {
              data: doodleData
            });

          case 62:
            // Save state
            console.log("handleDoodleTask - save task state");
            taskState.lastRunTimestamp = runStartTimestamp;
            _context8.next = 66;
            return setObjectJsonData(settings.serverStateBucket, TASK_STATE_KEY, taskState);

          case 66:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, null, [[39, 50, 53, 56]]);
  }));

  return function handleDoodleTask() {
    return _ref6.apply(this, arguments);
  };
}();

var handler = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(event) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            console.log("handler START");
            _context.next = 4;
            return handleDoodleTask();

          case 4:
            return _context.abrupt("return", {
              statusCode: 200
            });

          case 7:
            _context.prev = 7;
            _context.t0 = _context["catch"](0);
            console.error("handler FAILED", {
              err: _context.t0
            });
            return _context.abrupt("return", {
              statusCode: 500
            });

          case 11:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 7]]);
  }));

  return function handler(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.handler = handler;
