export declare type Resolve<T> = (value: T) => T | PromiseLike<T>;
declare type OneInput = AudioNode | AudioParam;
declare type OneOutput = AudioNode;
declare type Input = OneInput | OneInput[];
declare type Output = OneOutput | OneOutput[];
declare type InputAsync = Input | Promise<Input>;
declare type OutputAsync = Output | Promise<Output>;
export interface UseInputProps {
    resolveInput?: Resolve<InputAsync>;
}
export declare const useInput: (input: InputAsync, { resolveInput }: UseInputProps) => void;
export interface UseOutputProps {
    resolveOutput?: Resolve<Output>;
    getNext?: PromiseLike<Input>;
}
/**
 * Hooks up a node so that it is connectable to the next node.
 * @param output an AudioNode, array of AudioNodes, or a promise resolving to one of these from a child node
 * @param resolveOutput call this with output
 * @param getNext a promise resolving to the next node's input
 */
export declare const useOutput: (output: OutputAsync, { resolveOutput, getNext }: UseOutputProps) => void;
export {};
