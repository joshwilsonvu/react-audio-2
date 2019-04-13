"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

var AudioContextClass = window.AudioContext || window.webkitAudioContext;

var Series = function Series(_ref) {
  var children = _ref.children,
      context = _ref.context;

  var childArray = _react.Children.toArray(children);

  for (var i = 1; i < childArray.length; ++i) {
    var link = function link() {};
  }

  return null; // TODO
};

var Audio = function Audio(_ref2) {
  var next = _ref2.next;
  (0, _react.useEffect)(function () {}, [next]);
};

var AudioContext = function AudioContext(_ref3) {
  var children = _ref3.children,
      context = _ref3.context;
  var audioRef = (0, _react.useRef)(context || new AudioContextClass());
  return _react.default.createElement(Series, {
    context: context
  }, children);
};

var _default = AudioContext;
exports.default = _default;