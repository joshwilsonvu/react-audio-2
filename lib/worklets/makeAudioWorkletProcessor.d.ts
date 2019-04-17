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
export default function makeAudioWorkletProcessor(implementation: any, processOnly?: boolean, parameterDescriptors?: never[]): {
    new (options: any): {
        /**
         * The main loop.
         *
         * @param inputs {Array<Array<Float32Array>>}
         * @param outputs {Array<Array<Float32Array>>}
         * @param parameters
         * @return {boolean} whether to continue
         */
        process(inputs: any, outputs: any, parameters: any): boolean;
        /**
         * On the first frame, determines whether the implementation is an object, class, function, or generator,
         * and sets this.tick accordingly. All future frames will call this.tick.
         *
         * @param args
         * @return {*}
         * @private
         */
        first(args: any): any;
        stop(): void;
    };
    readonly parameterDescriptors: any;
};
