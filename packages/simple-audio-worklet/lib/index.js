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
 * @param implementation a regular function, a generator function, or a class
 *                       that defines tick() to be wrapped in a subclass of AudioWorkletProcessor.
 *                       Can provide a property parameterDescriptors that defines the relevant AudioParams.
 *
 * @param processOnly if true, runs only when there is input. Defaults to false.
 *
 * @param parameterDescriptors an array of AudioWorklet parameter descriptors.
 *                         Can be passed instead as a property of implementation. Defaults to [].
 *
 * @return a subclass of AudioWorkletProcessor that wraps the implementation
 * @throws if processing is attempted on a finished generator, possible for processors but not sources
 */
export function makeAudioWorkletProcessor(implementation, processOnly = false, parameterDescriptors = []) {
    class Subclass extends AudioWorkletProcessor {
        constructor(options) {
            super(options);
            this.tick = this.first; // will be switched after first
            this.isDone = false;
            this.port.onmessage = e => {
                if (e.data.toString().toLowerCase() === 'stop') {
                    this.stop();
                }
            };
        }
        static get parameterDescriptors() {
            return implementation.parameterDescriptors || parameterDescriptors;
        }
        /**
         * The main loop.
         *
         * @param inputs {Array<Array<Float32Array>>}
         * @param outputs {Array<Array<Float32Array>>}
         * @param parameters
         * @return {boolean} whether to continue
         */
        process(inputs, outputs, parameters) {
            if (this.isDone) {
                throw new RangeError('Attempted to process after iterator has finished.');
            }
            // Adapts for a single-input (optional), single-output processor, which should suit most cases.
            // Each input/output can have multiple channels.
            const input = inputs[0] || []; // empty array if no input
            const output = outputs[0];
            // Because this is such a hot loop (3ms at 44.1kHz), allocate objects only once to avoid frequent GC.
            const args = { parameters: {}, input: new Float32Array(), channelCount: output.length };
            // Most parameters don't need sample-accurate updates, so they are arrays with length 1.
            // Keep track of the ones that do.
            const changed = [];
            // Initialize the first frame parameters.
            for (let key in parameters) {
                if (parameters.hasOwnProperty(key)) {
                    args.parameters[key] = parameters[key][0];
                    if (parameters[key].length !== 1) {
                        changed.push(key);
                    }
                }
            }
            // Main loop, always 128 frames
            for (let frame = 0; frame < output[0].length; ++frame) {
                // Update the parameters that have changed, if any.
                for (let key of changed) {
                    args.parameters[key] = parameters[key][frame];
                }
                // Update the input value, if any, with an array of samples in the single frame.
                for (let channel = 0; channel < input.length; channel++) {
                    args.input[channel] = input[channel][frame];
                }
                // Get the next value, initializing the implementation on its first call.
                let value = this.tick(args);
                if (isYieldOutput(value)) {
                    // if generator-style return, destructure object
                    ({ value, done: this.isDone } = value);
                }
                // Signal that the processor is done synthesizing/processing.
                if (this.isDone) {
                    this.port.postMessage('done');
                    return false; // done, don't continue
                }
                // Accept arrays as mono or multi-channel frames, and numbers as mono frames.
                // If array is not wide enough to fill the output frame, use the first channel as mono.
                if (isFloat32Array(value)) {
                    if (value.length >= output.length) {
                        for (let channel = 0; channel < output.length; ++channel) {
                            output[channel][frame] = value[channel];
                        }
                    }
                    else {
                        for (let channel = 0; channel < output.length; ++channel) {
                            output[channel][frame] = value[0];
                        }
                    }
                }
                else {
                    for (let channel = 0; channel < output.length; ++channel) {
                        output[channel][frame] = value;
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
        first(args) {
            // throws a new Error with this message if prerequisite not met
            const err = (e) => {
                throw new Error('Argument must be a regular function, a generator function, or a class that defines tick(). ' + (e || ''));
            };
            let value, tick, cleanup;
            if (isGenImpl(implementation)) {
                // implementation is a generator function
                let iterator = implementation.generator(args);
                tick = iterator.next.bind(iterator);
                cleanup = iterator.return && iterator.return.bind(iterator); // for releasing iterator to garbage collector
                value = 0; // generators delay frames by one, fill in one frame with a zero
            }
            else if (isClassImpl(implementation)) {
                // implementation is a class that has defined tick()
                let instance = new (implementation.class)();
                if (instance.tick) {
                    tick = instance.tick.bind(instance);
                    value = tick(args);
                }
                else {
                    err();
                }
            }
            else if (isPureImpl(implementation)) {
                // implementation is a plain function, ret is first result
                tick = implementation.pure;
                value = tick(args);
            }
            if (!tick) {
                err();
            }
            // all subsequent calls to this.tick() will hit the implementation
            this.tick = tick;
            this.cleanup = cleanup;
            return value;
        }
        stop() {
            this.isDone = true;
            this.cleanup && this.cleanup();
        }
    }
    return Subclass;
}
function isClassImpl(value) {
    return value.hasOwnProperty('class');
}
function isGenImpl(value) {
    return value.hasOwnProperty('generator');
}
function isPureImpl(value) {
    return value.hasOwnProperty('pure');
}
function isYieldOutput(value) {
    return value.hasOwnProperty('value');
}
function isFloat32Array(value) {
    return value.hasOwnProperty('length');
}
//# sourceMappingURL=index.js.map