export declare type Resolve<T> = (value: T) => T | PromiseLike<T>;
export declare type OneInput = AudioNode | AudioParam;
export declare type OneOutput = AudioNode;
export declare type Input = OneInput[];
export declare type Output = OneOutput[];
export interface IO {
    input: Input;
    output: Output;
}
