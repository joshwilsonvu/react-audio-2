"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = require("react");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var context = new (window.AudioContext || window.webkitAudioContext)(),
    master = new GainNode(context),
    analyzer = new AnalyserNode(context, {
  fftSize: 8192,
  smoothingTimeConstant: 0.9,
  minDecibels: -80,
  maxDecibels: -30
});
master.connect(context.destination);
master.connect(analyzer);
var globals = (0, _react.createContext)({
  context: context,
  master: master,
  analyzer: analyzer
});
/**
 * Grants a component access to a shared AudioContext.
 */

var _default = function _default() {
  var _useContext = (0, _react.useContext)(globals),
      context = _useContext.context,
      master = _useContext.master,
      analyzer = _useContext.analyzer;

  (0, _react.useEffect)(function () {
    return (
      /*#__PURE__*/
      _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return context.close();

              case 2:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }))
    );
  }, [context]);
  return {
    context: context,
    master: master,
    analyzer: analyzer
  };
};

exports.default = _default;