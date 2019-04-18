declare type OneInput = AudioNode | AudioParam;
declare type OneOutput = AudioNode;
declare type Input = OneInput[];
declare type Output = OneOutput[];
export interface Chain {
    input: Input;
    output: Output;
    setNext: (next: Chain) => void;
}
export interface IO {
    input: Input;
    output: Output;
}
declare type Resolve<T> = (value: T) => T | PromiseLike<T>;
export declare const useInput: (resolveInput: Resolve<OneInput[]>, input: OneInput[]) => void;
export declare const useOutput: (resolveOutput: Resolve<AudioNode[]>, output: AudioNode[], getNext: PromiseLike<OneInput[]>) => void;
export {};
