import {useEffect, useMemo, useState, useImperativeHandle, RefObject} from 'react';

type OneInput = AudioNode | AudioParam;
type OneOutput = AudioNode;
type Input = OneInput[];
type Output = OneOutput[];

const makeArray = <T>(val: T | T[] | null | undefined): T[] => val ? (Array.isArray(val) ? val : [val]) : [];

// pairwise connect all combinations of output and input nodes
const connectNodes = (output: Output, input: Input): void => {
  for (let o of output) {
    for (let i of input) {
      // @ts-ignore connect should accept both AudioNode and AudioParam
      o.connect(i);
    }
  }
};

// undo connectNodes()
const disconnectNodes = (output: Output, input: Input): void => {
  for (let o of output) {
    for (let i of input) {
      // @ts-ignore disconnect should accept both AudioNode and AudioParam
      o.disconnect(i);
    }
  }
};

export interface Chain {
  input: Input;
  output: Output;
  setNext: (next: Chain) => void;
}

/*
 * TODO
 *
 * Given nodes in series A and B:
 *
 * 1. Pass prop { next: Input } to A
 * 2. Pass prop { registerInput: (input: Input) => void } to B
 * 3. const [registeredInput, setRegisteredInput] = useState();
 *    const next = registeredInput;
 *    const i;
 *    const registerInput = (input) => {
 *      if (registeredInput[i] !== input) {
 *        setRegisteredInput(registeredInput.slice().splice(i, 1, input);
 *      }
 *    }
 * 4. PROFIT
 *
 *
 */

interface IO {
  input: Input,
  output: Output,
}

const useChain2 = (
  {next, setInput}: {
    next: Input,
    setInput: (input: Input) => void
  },
  input ?: Input | OneInput | null,
  output ?: Output | OneOutput | null,
): void => {
  let i = useMemo(() => makeArray(input), [input]);
  let o = useMemo(() => makeArray(output), [output]);

  setInput(i);
  useEffect(() => {
    connectNodes(o, next);
    return () => {
      disconnectNodes(o, next);
    }
  }, [next]);
};

// Call this private hook to let a node be connected to other nodes
export const useChain = (ref: RefObject<Chain>, input?: Input | OneInput | null, output?: Output | OneOutput | null): void => {
  let i = useMemo(() => makeArray(input), [input]);
  let o = useMemo(() => makeArray(output), [output]);
  const [next, setNext] = useState<Chain | null>(null);
  const nextInput = next && next.input;
  useEffect(() => {
    if (!nextInput) {
      throw new Error(`Attempted to connect to a node without an input`);
    }
    connectNodes(o, nextInput);
    return () => {
      disconnectNodes(o, nextInput);
    };
  }, [nextInput, o]);
  useImperativeHandle(ref, () => ({
    input: i,
    output: o,
    setNext
  }), [i, o, setNext]);
};
