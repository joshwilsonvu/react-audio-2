import * as React from 'react';
import {Children, cloneElement, memo, ReactElement, useMemo} from 'react';
import {Input, InputAsync, Output, OutputAsync, useIO} from '../hooks/useIO';

/*
 * Given node A and node B in series:
 *
 * 1. let resolveInput, resolveOutput;
 *    let getInput = new Promise(resolve => {resolveInput = resolve });
 *    let getOutput = new Promise(resolve => {resolveOutput = resolve });
 * 2. Pass prop { getNext: Promise<InputArr> = the getInput passed to B} to A
 * 3. Pass props { resolveInput: Resolve<InputArr>, resolveOutput: Resolve<OutputArr> } to B
 *    <A resolveOutput={resolveOutput} getNext={getNext}/>
 *    <B resolveInput={resolveInput}/>
 * 4. PROFIT
 */
const makeConnection = (A: ReactElement | null, B: ReactElement | null) => {
  let resolveInputB, resolveOutputA, getInputB, getOutputA;
  // Promise executors are run synchronously
  if (B) {
    getInputB = new Promise<Input>(resolve => {
      resolveInputB = resolve;
    });
    B = cloneElement(B, {
      resolveInput: resolveInputB
    });
  }
  if (A) {
    getOutputA = new Promise<Output>(resolve => {
      resolveOutputA = resolve;
    });
    A = cloneElement(A, {
      resolveOutput: resolveOutputA,
      getNext: getInputB
    });
  }
  return {
    A, B, getOutputA, getInputB
  }
};

const connectChildren = (childArray: ReactElement[]) => {
  childArray = childArray.slice(); // don't mutate original

  let firstInput: InputAsync, lastOutput: OutputAsync;
  if (childArray.length > 0) {
    const {getInputB, B} = makeConnection(null, childArray[0]);
    firstInput = getInputB!;
    childArray[0] = B!;
    for (let i = 1; i < childArray.length; ++i) {
      const {A, B} = makeConnection(childArray[i - 1], childArray[i]);
      childArray[i - 1] = A!;
      childArray[i] = B!;
    }
    const {getOutputA, A} =  makeConnection(childArray[childArray.length - 1], null);
    lastOutput = getOutputA!;
    childArray[childArray.length - 1] = A!;
  } else {
    firstInput = [];
    lastOutput = [];
  }

  return {
    childArray,
    firstInput,
    lastOutput
  };
};

const SeriesImpl = (props: { children: ReactElement | ReactElement[] } & UseIOProps) => {
  const {childArray, firstInput, lastOutput} = useMemo(() => {
    const array = Children.toArray(props.children);
    return connectChildren(array);
  }, [props.children]);

  useIO(firstInput, lastOutput, props);

  return <>{childArray}</>;
};

export const Series = memo(SeriesImpl);