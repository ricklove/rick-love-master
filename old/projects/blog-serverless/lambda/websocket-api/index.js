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

var toKeyValueArray = function toKeyValueArray(obj) {
  return Object.keys(obj).map(function (k) {
    return k;
  }).map(function (k) {
    return {
      key: k,
      value: obj[k]
    };
  });
};

var distinct = function distinct(items) {
  var set = new Set(items);
  return _toConsumableArray(set);
};
var groupItems = function groupItems(items, getKey) {
  var groups = {};

  var _iterator = _createForOfIteratorHelper(items),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var _groups$getKey;

      var x = _step.value;
      var g = (_groups$getKey = groups[getKey(x)]) !== null && _groups$getKey !== void 0 ? _groups$getKey : groups[getKey(x)] = [];
      g.push(x);
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  return groups;
};

var settings = {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  table: process.env.TABLE
};
var handleWebsocketEvent = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(event) {
    var _connectionInfo$lastC;

    var data, webSocketClient, connectionInfo, sendCount, sendFailureIds, BATCH_COUNT, batches, removedConnectionIds, invalidConnectionIds, _iterator2, _step2, connectionId, x, result, toRemove;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            console.log("handleWebsocketEvent", {
              body: event.body,
              requestContext: event.requestContext
            }); // Connect and Disconnect don't have the key, so don't work with this table structure

            if (!(event.requestContext.eventType !== "MESSAGE")) {
              _context2.next = 3;
              break;
            }

            return _context2.abrupt("return");

          case 3:
            data = JSON.parse(event.body);
            webSocketClient = new AWS__default['default'].ApiGatewayManagementApi({
              // apiVersion: `2018-11-29`,
              endpoint: "https://".concat(event.requestContext.domainName, "/").concat(event.requestContext.stage)
            });
            console.log("handleWebsocketEvent - Getting connection info", {});
            _context2.next = 8;
            return getOrAddConnectionId_DynamoDb({
              websocketKey: data.channelKey,
              connectionIds: [event.requestContext.connectionId]
            });

          case 8:
            connectionInfo = _context2.sent;
            // console.log(`handleWebsocketEvent - connectionIds`, { connectionIds: connectionIds.connectionIds });
            // Echo all messages to every client
            console.log("handleWebsocketEvent - Echo data to every client", {
              data: data
            });
            sendCount = 0;
            sendFailureIds = [];
            BATCH_COUNT = 10;
            batches = toKeyValueArray(groupItems(connectionInfo.connectionIds.map(function (x, i) {
              return {
                connectionId: x,
                batchId: i % BATCH_COUNT
              };
            }), function (x) {
              return "".concat(x.batchId);
            }));
            _context2.next = 16;
            return Promise.all(batches.map( /*#__PURE__*/function () {
              var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(batch) {
                var _iterator, _step, item, connectionId;

                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        console.log("handleWebsocketEvent - Send to clients - Batch START", {
                          batchId: batch.key,
                          length: batch.value.length
                        });
                        _iterator = _createForOfIteratorHelper(batch.value.reverse());
                        _context.prev = 2;

                        _iterator.s();

                      case 4:
                        if ((_step = _iterator.n()).done) {
                          _context.next = 22;
                          break;
                        }

                        item = _step.value;
                        connectionId = item.connectionId;
                        _context.prev = 7;
                        _context.next = 10;
                        return webSocketClient.postToConnection({
                          ConnectionId: connectionId,
                          Data: "".concat(event.body)
                        }).promise();

                      case 10:
                        sendCount++;
                        _context.next = 20;
                        break;

                      case 13:
                        _context.prev = 13;
                        _context.t0 = _context["catch"](7);
                        console.log("handleWebsocketEvent - SEND ERROR - Failed to send to connection", {
                          x: connectionId
                        }); // Remove failed connections

                        sendFailureIds.push(connectionId);

                        if (!(sendFailureIds.length > 50)) {
                          _context.next = 20;
                          break;
                        }

                        console.log("handleWebsocketEvent - EARLY CLEAN - Many sendFailures found - Not able to send to all clients", {
                          x: connectionId
                        });
                        return _context.abrupt("return");

                      case 20:
                        _context.next = 4;
                        break;

                      case 22:
                        _context.next = 27;
                        break;

                      case 24:
                        _context.prev = 24;
                        _context.t1 = _context["catch"](2);

                        _iterator.e(_context.t1);

                      case 27:
                        _context.prev = 27;

                        _iterator.f();

                        return _context.finish(27);

                      case 30:
                        console.log("handleWebsocketEvent - Send to clients - Batch DONE", {
                          batchId: batch.key,
                          length: batch.value.length
                        });

                      case 31:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee, null, [[2, 24, 27, 30], [7, 13]]);
              }));

              return function (_x2) {
                return _ref2.apply(this, arguments);
              };
            }()));

          case 16:
            console.log("handleWebsocketEvent - Send to clients", {
              sendCount: sendCount
            }); // Periodically clean up clients (5 mins)

            if (!(sendFailureIds.length > 0 || Date.now() > 5 * 60 * 1000 + ((_connectionInfo$lastC = connectionInfo.lastConnectionCleanedTimestamp) !== null && _connectionInfo$lastC !== void 0 ? _connectionInfo$lastC : 0))) {
              _context2.next = 63;
              break;
            }

            console.log("handleWebsocketEvent - cleaning up clients list", {});

            if (!(sendFailureIds.length > 0)) {
              _context2.next = 23;
              break;
            }

            console.log("Removing invalid connectionIds", {
              sendFailureIds: sendFailureIds
            });
            _context2.next = 23;
            return removeConnectionId_DynamoDb({
              websocketKey: data.channelKey,
              connectionIds: sendFailureIds
            });

          case 23:
            removedConnectionIds = [].concat(sendFailureIds);
            invalidConnectionIds = [];
            _iterator2 = _createForOfIteratorHelper(connectionInfo.connectionIds);
            _context2.prev = 26;

            _iterator2.s();

          case 28:
            if ((_step2 = _iterator2.n()).done) {
              _context2.next = 51;
              break;
            }

            connectionId = _step2.value;
            x = connectionId;

            if (!removedConnectionIds.includes(x)) {
              _context2.next = 33;
              break;
            }

            return _context2.abrupt("return");

          case 33:
            _context2.prev = 33;
            _context2.next = 36;
            return webSocketClient.getConnection({
              ConnectionId: x
            }).promise();

          case 36:
            result = _context2.sent;

            if (!result.LastActiveAt) {
              invalidConnectionIds.push(x);
            }

            _context2.next = 43;
            break;

          case 40:
            _context2.prev = 40;
            _context2.t0 = _context2["catch"](33);
            // Remove failed connections
            invalidConnectionIds.push(x);

          case 43:
            if (!(invalidConnectionIds.length > 50)) {
              _context2.next = 49;
              break;
            }

            toRemove = invalidConnectionIds.splice(0, invalidConnectionIds.length);
            console.log("Removing invalid connectionIds", {
              toRemove: toRemove
            }); // eslint-disable-next-line no-await-in-loop

            _context2.next = 48;
            return removeConnectionId_DynamoDb({
              websocketKey: data.channelKey,
              connectionIds: toRemove
            });

          case 48:
            removedConnectionIds.push.apply(removedConnectionIds, _toConsumableArray(toRemove));

          case 49:
            _context2.next = 28;
            break;

          case 51:
            _context2.next = 56;
            break;

          case 53:
            _context2.prev = 53;
            _context2.t1 = _context2["catch"](26);

            _iterator2.e(_context2.t1);

          case 56:
            _context2.prev = 56;

            _iterator2.f();

            return _context2.finish(56);

          case 59:
            if (!(invalidConnectionIds.length > 0)) {
              _context2.next = 63;
              break;
            }

            console.log("Removing invalid connectionIds", {
              invalidConnectionIds: invalidConnectionIds
            });
            _context2.next = 63;
            return removeConnectionId_DynamoDb({
              websocketKey: data.channelKey,
              connectionIds: invalidConnectionIds
            });

          case 63:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[26, 53, 56, 59], [33, 40]]);
  }));

  return function handleWebsocketEvent(_x) {
    return _ref.apply(this, arguments);
  };
}();
// DynamoDB
var db = new AWS__default['default'].DynamoDB();

var getOrAddConnectionId_DynamoDb = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(args) {
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return getAndUpdateConnectionInfo(_objectSpread2(_objectSpread2({}, args), {}, {
              action: "add"
            }));

          case 2:
            return _context3.abrupt("return", _context3.sent);

          case 3:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function getOrAddConnectionId_DynamoDb(_x3) {
    return _ref3.apply(this, arguments);
  };
}();

var removeConnectionId_DynamoDb = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(args) {
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return getAndUpdateConnectionInfo(_objectSpread2(_objectSpread2({}, args), {}, {
              action: "remove"
            }));

          case 2:
            return _context4.abrupt("return", _context4.sent);

          case 3:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function removeConnectionId_DynamoDb(_x4) {
    return _ref4.apply(this, arguments);
  };
}();

var getAndUpdateConnectionInfo = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(_ref5) {
    var _existingConnectionIn, _existingConnectionIn2;

    var websocketKey, connectionIds, action, key, result, existingItem, existingConnectionInfo, existingConnectionIds, allIds, valueJsonObj, item;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            websocketKey = _ref5.websocketKey, connectionIds = _ref5.connectionIds, action = _ref5.action;
            key = {
              key: {
                S: websocketKey
              }
            };
            _context5.next = 4;
            return db.getItem({
              TableName: settings.table,
              Key: key
            }).promise();

          case 4:
            result = _context5.sent;
            // console.log(`updateConnectionIds - existing`, { item: result.item, result });
            existingItem = result.Item;
            existingConnectionInfo = existingItem ? JSON.parse(existingItem.value.S) : null;
            existingConnectionIds = (_existingConnectionIn = existingConnectionInfo === null || existingConnectionInfo === void 0 ? void 0 : existingConnectionInfo.connectionIds) !== null && _existingConnectionIn !== void 0 ? _existingConnectionIn : [];
            allIds = action === "add" ? distinct([].concat(_toConsumableArray(existingConnectionIds), _toConsumableArray(connectionIds !== null && connectionIds !== void 0 ? connectionIds : []))) : distinct(existingConnectionIds.filter(function (x) {
              return !connectionIds.includes(x);
            }));

            if (!(existingConnectionIds.length !== allIds.length)) {
              _context5.next = 14;
              break;
            }

            // console.log(`updateConnectionIds - connectionIds changed`, {});
            valueJsonObj = {
              connectionIds: allIds,
              lastConnectionChangeTimestamp: Date.now(),
              lastConnectionCleanedTimestamp: action === "remove" ? Date.now() : existingConnectionInfo === null || existingConnectionInfo === void 0 ? void 0 : existingConnectionInfo.lastConnectionCleanedTimestamp
            };
            item = _objectSpread2(_objectSpread2({}, key), {}, {
              value: {
                S: JSON.stringify(valueJsonObj)
              }
            });
            _context5.next = 14;
            return db.putItem({
              TableName: settings.table,
              Item: item
            }).promise();

          case 14:
            return _context5.abrupt("return", {
              connectionIds: allIds,
              lastConnectionChangeTimestamp: (_existingConnectionIn2 = existingConnectionInfo === null || existingConnectionInfo === void 0 ? void 0 : existingConnectionInfo.lastConnectionChangeTimestamp) !== null && _existingConnectionIn2 !== void 0 ? _existingConnectionIn2 : Date.now(),
              lastConnectionCleanedTimestamp: existingConnectionInfo === null || existingConnectionInfo === void 0 ? void 0 : existingConnectionInfo.lastConnectionCleanedTimestamp
            });

          case 15:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function getAndUpdateConnectionInfo(_x5) {
    return _ref6.apply(this, arguments);
  };
}();

var corsHeaders = {
  'Access-Control-Allow-Origin': "*",
  'Access-Control-Allow-Credentials': true
};

var handler = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(event) {
    var _event$body, _event$requestContext, _event$requestContext2, _ref2, result;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            console.log("handler START");
            _context.next = 4;
            return handleWebsocketEvent({
              body: (_event$body = event.body) !== null && _event$body !== void 0 ? _event$body : "",
              requestContext: _objectSpread2(_objectSpread2({}, event.requestContext), {}, {
                connectionId: (_event$requestContext = event.requestContext.connectionId) !== null && _event$requestContext !== void 0 ? _event$requestContext : "",
                domainName: (_event$requestContext2 = event.requestContext.domainName) !== null && _event$requestContext2 !== void 0 ? _event$requestContext2 : "",
                stage: event.requestContext.stage,
                eventType: (_ref2 = event.requestContext.eventType) !== null && _ref2 !== void 0 ? _ref2 : "UNKNOWN"
              })
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
