"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = makeAudioWorkletProcessor;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

/*
 * This file defines a custom audio processor. See https://webaudio.github.io/web-audio-api/#audioworklet.
 *
 * Globals: (from webaudio.github.io/web-audio-api/#audioworkletglobalscope)
 * void registerProcessor(name, processorCtor) - call this with your class, frame.e. registerProcessor(Foo.name, Foo)
 * unsigned long long currentFrame - the number of the current frame (a frame is one time point across channels)
 * double currentTime - the amount of time elapsed in seconds since audio has begun
 * float sampleRate - the sample rate in Hz
 */

/**
 * Wraps a generator so that it is suitable for use in an AudioWorklet.
 *
 * Because of the nature of generators, args will only be sent to the iterator
 * after the first yield statement, as in { let args; for(;;) { args = yield result; } }
 * Thus, you are encouraged to include one initial yield to get the first arguments.
 * If this goes unimplemented, the result will be essentially a single sample delay,
 * which is not a big deal for most processors.
 *
 * Example:
 * function* addNoise({parameters, input, channelCount}) {
 *   for (;;) {
 *     let noise = (Math.random() * 2 - 1) * parameters.gain;
 *     ({parameters, input, channelCount} = yield input + outputValue);
 *   }
 * }
 *
 * @param {Generator|Function|Class} implementation a regular function, a generator function, or a class
 *                                   or object that defines tick() to be wrapped in a subclass of AudioWorkletProcessor.
 *                                   Can provide a property parameterDescriptors that defines the relevant AudioParams.
 *
 * @param {boolean} processOnly if true, runs only when there is input. Defaults to false.
 *
 * @param {Array<Object>?} parameterDescriptors an array of AudioWorklet parameter descriptors.
 *                         Can be passed instead as a property of implementation. Defaults to [].
 *
 * @return {Class} a subclass of AudioWorkletProcessor that wraps the generator
 * @throws {RangeError} if processing is attempted on a finished generator, possible for processors but not sources
 */
function makeAudioWorkletProcessor(implementation) {
  var processOnly = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var parameterDescriptors = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  return (
    /*#__PURE__*/
    function (_AudioWorkletProcesso) {
      _inherits(_class, _AudioWorkletProcesso);

      function _class(options) {
        var _this;

        _classCallCheck(this, _class);

        _this = _possibleConstructorReturn(this, _getPrototypeOf(_class).call(this, options));
        _this.tick = _this.first; // will be switched after first

        _this.isDone = false;

        _this.port.onmessage = function (e) {
          if (e.data.toString().toLowerCase() === 'stop') {
            _this.stop();
          }
        };

        return _this;
      }

      _createClass(_class, [{
        key: "process",

        /**
         * The main loop.
         *
         * @param inputs {Array<Array<Float32Array>>}
         * @param outputs {Array<Array<Float32Array>>}
         * @param parameters
         * @return {boolean} whether to continue
         */
        value: function process(inputs, outputs, parameters) {
          if (this.isDone) {
            throw new RangeError('Attempted to process after iterator has finished.');
          } // Adapts for a single-input (optional), single-output processor, which should suit most cases.
          // Each input/output can have multiple channels.


          var input = inputs[0] || []; // empty array if no input

          var output = outputs[0]; // Because this is such a hot loop (3ms at 44.1kHz), allocate objects only once to avoid frequent GC.

          var args = {
            parameters: {},
            input: [],
            channelCount: output.length
          }; // Most parameters don't need sample-accurate updates, so they are arrays with length 1.
          // Keep track of the ones that do.

          var changed = []; // Initialize the first frame parameters.

          for (var key in parameters) {
            if (parameters.hasOwnProperty(key)) {
              args.parameters[key] = parameters[key][0];

              if (parameters[key].length !== 1) {
                changed.push(key);
              }
            }
          } // Main loop, always 128 frames


          for (var frame = 0; frame < output[0].length; ++frame) {
            // Update the parameters that have changed, if any.
            for (var _i = 0, _changed = changed; _i < _changed.length; _i++) {
              var _key = _changed[_i];
              args.parameters[_key] = parameters[_key][frame];
            } // Update the input value, if any, with an array of samples in the single frame.


            for (var channel = 0; channel < input.length; channel++) {
              args.input[channel] = input[channel][frame];
            } // Get the next value, initializing the implementation on its first call.


            var value = this.tick(args);

            if (value.hasOwnProperty('value')) {
              // if generator-style return, destructure object
              var _value = value;
              value = _value.value;
              this.isDone = _value.done;
            } // Signal that the processor is done synthesizing/processing.


            if (this.isDone) {
              this.port.postMessage('done');
              return false; // done, don't continue
            } // Accept arrays as mono or multi-channel frames, and numbers as mono frames.


            if (value.length === output.length) {
              for (var _channel = 0; _channel < output.length; ++_channel) {
                output[_channel][frame] = value[_channel];
              }
            } else {
              for (var _channel2 = 0; _channel2 < output.length; ++_channel2) {
                output[_channel2][frame] = value;
              }
            }
          }

          return !processOnly; // keep alive if generator
        }
        /**
         * On the first frame, determines whether the implementation is an object, class, function, or generator,
         * and sets this.tick accordingly. All future frames will call this.tick.
         *
         * @param args
         * @return {*}
         * @private
         */

      }, {
        key: "first",
        value: function first(args) {
          // throws a new Error with this message if prerequisite not met
          var err = function err(e) {
            throw new Error('Argument must be a regular function, a generator function, or a class or object that defines tick(). ' + (e || ''));
          };

          var source = implementation.toString().trim().slice(0, 11); // long enough for function*

          var value, tick, cleanup;

          try {
            if (implementation.tick) {
              // implementation is an object that has defined tick()
              tick = implementation.tick.bind(implementation);
              value = tick(args);
            } else if (/^function ?\*/.test(source)) {
              // implementation is a generator function
              var iterator = implementation(args);
              tick = iterator.next.bind(iterator);
              cleanup = iterator.return.bind(iterator); // for releasing iterator to garbage collector

              value = args.input || 0; // generators delay frames by one, fill in one frame with a zero
            } else if (/^class/.test(source)) {
              // implementation is a class that has defined tick()
              var instance = new implementation(args);

              if (instance.tick) {
                tick = instance.tick.bind(instance);
                value = tick(args);
              } else {
                err();
              }
            } else {
              var ret = implementation(args);

              if (ret.tick) {
                // implementation is a class-like object that has defined tick()
                tick = ret.tick.bind(ret);
                value = tick(args);
              } else {
                // implementation is a plain function, ret is first result
                tick = implementation;
                value = ret;
              }
            }
          } catch (e) {
            err(e);
          }

          if (!tick) {
            err();
          } // all subsequent calls to this.tick() will hit the implementation


          this.tick = tick;
          this.cleanup = cleanup;
          return value;
        }
      }, {
        key: "stop",
        value: function stop() {
          this.isDone = true;
          this.cleanup && this.cleanup();
        }
      }], [{
        key: "parameterDescriptors",
        get: function get() {
          return implementation.parameterDescriptors || parameterDescriptors;
        }
      }]);

      return _class;
    }(_wrapNativeSuper(AudioWorkletProcessor))
  );
}