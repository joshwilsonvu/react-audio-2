/*
import * as React from 'react';
import {ReactElement, RefObject, useMemo} from 'react';
import {Chain} from './useChain';

// add refs to props.children
export const useChildRefs = (children: any) => {
  return useMemo(() => {
    const refs = [] as RefObject<Chain>[];
    const reffedChildren = React.Children.map(children, (current: ReactElement) => {
      const ref = React.createRef<Chain>();
      refs.push(ref);
      return React.cloneElement(current, {ref});
    });
    return {reffedChildren, refs};
  }, [children]);
};

type ChildCallbackRef = (node: Chain, index: number) => any;

export const useChildCallbackRefs = (children: any, callback: ChildCallbackRef) => {
  return useMemo(() => (
    React.Children.map(children, (current: ReactElement, index: number): ReactElement => (
      React.cloneElement(current, {
        ref: function (node: Chain) {
          callback(node, index);
        }
      })
    ))
  ), [children, callback]);
};



 */
/*
 * Given nodes in series A and B:
 *
 * 1. Pass prop { next: InputArr } to A
 * 2. Pass prop { registerInput: (input: InputArr) => void } to B
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
 * SCRATCH THAT
 *
 * 1. Pass prop { getNext: Promise<InputArr> } to A
 * 2. Pass props { resolveInput: Resolve<InputArr>, resolveOutput: Resolve<OutputArr> } to B
 * 3. let resolveInput, resolveOutput;
 *    let getInput = new Promise(resolve => {resolveInput = resolve });
 *    let getOutput = new Promise(resolve => {resolveOutput = resolve });
 *    <A resolveOutput={resolveOutput} getNext={getNext}/>
 *    <B resolveInput={resolveInput}/>
 *
 */
/*
interface ChainProps {
  next?: InputArr,
  setInput?: (input: InputArr) => void,
  setOutput?: (output: OutputArr) => void
}
*/
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
//# sourceMappingURL=old.js.map