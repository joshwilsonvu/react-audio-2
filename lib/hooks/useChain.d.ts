import { RefObject } from 'react';
declare type OneInput = AudioNode | AudioParam;
declare type OneOutput = AudioNode;
declare type Input = OneInput[];
declare type Output = OneOutput[];
export interface Chain {
    input: Input;
    output: Output;
    setNext: (next: Chain) => void;
}
export declare const useChain: (ref: RefObject<Chain>, input?: AudioNode | AudioParam | OneInput[] | null | undefined, output?: AudioNode | AudioNode[] | null | undefined) => void;
export {};
