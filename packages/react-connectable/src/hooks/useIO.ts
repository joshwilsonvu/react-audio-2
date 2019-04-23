import {useCallback, useEffect, useRef, useState} from 'react';

export type Resolve<T> = (value: T) => T | PromiseLike<T>;

type OneInput = AudioNode | AudioParam;
type OneOutput = AudioNode;
export type Input = OneInput | OneInput[];
export type Output = OneOutput | OneOutput[];
export type InputAsync = Input | PromiseLike<Input>;
export type OutputAsync = Output | PromiseLike<Output>;

// if not an array, make it an array
const makeArray = <T>(val: T | T[] | null | undefined): T[] => val ? (Array.isArray(val) ? val : [val]) : [];

// pairwise connect all combinations of output and input nodes
const connectNodes = (output: Output, input: Input): void => {
  const inArr = makeArray(input);
  const outArr = makeArray(output);
  for (let o of outArr) {
    for (let i of inArr) {
      // @ts-ignore connect should accept both AudioNode and AudioParam
      o.connect(i);
    }
  }
};

// undo connectNodes()
const disconnectNodes = (output: Output, input: Input): void => {
  const inArr = makeArray(input);
  const outArr = makeArray(output);
  for (let o of outArr) {
    for (let i of inArr) {
      // @ts-ignore disconnect should accept both AudioNode and AudioParam
      o.disconnect(i);
    }
  }
};

// When the promise resolves (or a plain value is given), execute the callback with the result.
// Memoizing the callback is not strictly required but helps.
const usePromiseResult = <T>(promise: T | PromiseLike<T>, callback?: (value: T) => any) => {
  const callbackRef = useRef<(value: T) => any>();
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);
  useEffect(() => {
    let cancelled = false;
    Promise.resolve(promise).then(value => {
      !cancelled && callbackRef.current && callbackRef.current(value);
    });
    return () => {
      cancelled = true;
    }
  }, [promise]);
};

export interface UseInputProps {
  resolveInput?: Resolve<InputAsync>
}

export const useInput = (
  input: InputAsync,
  {resolveInput}: UseInputProps,
): void => {
  usePromiseResult(input, resolveInput);
};

export interface UseOutputProps {
  resolveOutput?: Resolve<Output>,
  getNext?: PromiseLike<Input>
}

/**
 * Hooks up a node so that it is connectable to the next node.
 * @param output an AudioNode, array of AudioNodes, or a promise resolving to one of these from a child node
 * @param resolveOutput call this with output
 * @param getNext a promise resolving to the next node's input
 */
export const useOutput = (
  output: OutputAsync,
  {resolveOutput, getNext}: UseOutputProps,
): void => {
  const [next, setNext] = useState([] as Input);
  const [cachedOutput, setCachedOutput] = useState([] as Output);

  const handleOutput = useCallback((output: Output) => {
    setCachedOutput(output);
  }, [resolveOutput]);

  usePromiseResult(output, handleOutput);

  usePromiseResult(getNext!, setNext);

  useEffect(() => {
    resolveOutput && resolveOutput(cachedOutput);
  }, [cachedOutput]);

  useEffect(() => {
    connectNodes(cachedOutput, next);
    return () => {
      disconnectNodes(cachedOutput, next);
    }
  }, [cachedOutput, next]);
};

export interface UseIOProps extends UseInputProps, UseOutputProps {
}

export const useIO = (
  input: InputAsync,
  output: OutputAsync,
  props: UseIOProps
) => {
  useInput(input, props);
  useOutput(output, props);
};
