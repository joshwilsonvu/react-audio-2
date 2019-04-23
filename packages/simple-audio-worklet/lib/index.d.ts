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
export declare function makeAudioWorkletProcessor(implementation: Implementation, processOnly?: boolean, parameterDescriptors?: never[]): IAudioWorkletProcessor;
interface IAudioWorkletProcessor {
    readonly port: MessagePort;
    process(inputs: Indexable<Indexable<Float32Array>>, outputs: Indexable<Indexable<Float32Array>>, parameters: ProcessParameters): void;
}
interface ProcessParameters {
    [param: string]: Float32Array;
}
interface FrameArgs {
    input: Float32Array;
    parameters: {
        [param: string]: number;
    };
    readonly channelCount: number;
}
declare type FrameOutput = number | Float32Array | {
    value: number | Float32Array;
    done: boolean;
};
interface SharedImpl {
    parameterDescriptors?: Array<AudioParamDescriptor>;
}
interface ClassImpl extends SharedImpl {
    class: {
        new (): {
            tick: (args?: FrameArgs) => FrameOutput;
        };
    };
}
interface GenImpl extends SharedImpl {
    generator: {
        (args: FrameArgs): Generator;
        return: (value?: any) => any;
        parameterDescriptors?: Array<AudioParamDescriptor>;
    };
}
interface PureImpl extends SharedImpl {
    pure: {
        (args: FrameArgs): FrameOutput;
        parameterDescriptors?: Array<AudioParamDescriptor>;
    };
}
declare type Implementation = ClassImpl | GenImpl | PureImpl;
interface Indexable<T> {
    [index: number]: T;
    readonly length: number;
}
export {};
