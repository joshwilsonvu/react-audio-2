import { useEffect, useMemo, useState } from 'react';
const makeArray = (val) => val ? (Array.isArray(val) ? val : [val]) : [];
// pairwise connect all combinations of output and input nodes
const connectNodes = (output, input) => {
    for (let o of output) {
        for (let i of input) {
            // @ts-ignore connect should accept both AudioNode and AudioParam
            o.connect(i);
        }
    }
};
// undo connectNodes()
const disconnectNodes = (output, input) => {
    for (let o of output) {
        for (let i of input) {
            // @ts-ignore disconnect should accept both AudioNode and AudioParam
            o.disconnect(i);
        }
    }
};
export const useInput = (resolveInput, input) => {
    let i = useMemo(() => makeArray(input), [input]);
    useEffect(() => {
        resolveInput(i);
    }, [i]);
};
export const useOutput = (resolveOutput, output, getNext) => {
    const o = useMemo(() => makeArray(output), [output]);
    const [next, setNext] = useState([]);
    useEffect(() => {
        getNext.then(newNext => {
            if (newNext !== next) {
                setNext(newNext);
            }
        });
    }, [getNext]);
    useEffect(() => {
        connectNodes(o, next);
        return () => {
            disconnectNodes(o, next);
        };
    }, [o, next]);
};
/*
export const useChain = (
  {
    getNext,
    resolveInput,
    resolveOutput
  }: {
    getNext: Promise<InputArr>,
    resolveInput: (value: InputArr) => InputArr | PromiseLike<InputArr>,
    resolveOutput: (value: OutputArr) => OutputArr,
  },
  input: InputArr,
  output: OutputArr
): void => {

};

export const useChain3 = (
  {next = [], setInput, setOutput}: ChainProps,
  input ?: InputArr | OneInput | null,
  output ?: OutputArr | OneOutput | null,
  ): void => {
    let i = useMemo(() => makeArray(input), [input]);
    let o = useMemo(() => makeArray(output), [output]);

    useEffect(() => {
      setInput && setInput(i);
      connectNodes(o, next);
      return () => {
        disconnectNodes(o, next);
      }

    }, [next, setInput]);
  }
;

// Call this private hook to let a node be connected to other nodes
const useChain2 = (ref: RefObject<Chain>, input?: InputArr | OneInput | null, output?: OutputArr | OneOutput | null): void => {
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
*/ 
//# sourceMappingURL=useChain.js.map