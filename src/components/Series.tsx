import * as React from 'react';
import {Children, useCallback, useEffect, memo, useMemo, ReactElement, cloneElement, ReactFragment} from 'react';
import {useReducer} from 'react';
import {useCloneChildren} from '../hooks/useCloneChildren';
import {Resolve, useInput, useOutput} from '../hooks/useIO';
import get = Reflect.get;

/*
interface Entry {
  key: number,
  node: IO,
}

const reducer = (state: {[index: number]: IO}, action: Entry) => {
  return {...state, [action.key]: action.node};
};

export const useSeries = (children: any) => {
  const [nodeArray, dispatch] = useReducer(reducer, {});

  const callbackRef = useCallback((node, key) => {
    dispatch({node, key});
  }, [children]);

  const clonedChildren = useMemo(() => {
    let promise = null;
    return Children.toArray(children).reduce((acc, current, index) => {
      if (acc.length) {

      } else {

      }
    }, [])
  }, [children]);

  const clonedChildren = useCloneChildren(children, (child, index) => ({
    setInput: dispatch,
    next: nodeArray[index! + 1],
  }));

  return {clonedChildren, nodeArray};
};
*/

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
    getInputB = new Promise(resolve => {
      resolveInputB = resolve;
    });
    B = cloneElement(B, {
      resolveInput: resolveInputB
    });
  }
  if (A) {
    getOutputA = new Promise(resolve => {
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

  let firstInput, lastOutput;
  if (childArray.length > 0) {
    const {getInputB, B} = makeConnection(null, childArray[0]);
    firstInput = getInputB;
    childArray[0] = B!;
    for (let i = 1; i < childArray.length; ++i) {
      const {A, B} = makeConnection(childArray[i - 1], childArray[i]);
      childArray[i - 1] = A!;
      childArray[i] = B!;
    }
    const {getOutputA, A} =  makeConnection(childArray[childArray.length - 1], null);
    lastOutput = getOutputA;
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

const SeriesImpl = (props: { children: ReactElement | ReactElement[] }) => {
  const array = Children.toArray(props.children);
  const {childArray, firstInput, lastOutput} = connectChildren(array);

  useInput(firstInput, props);
  useOutput(lastOutput, props);

  return <>{childArray}</>;
};

export const Series = memo(SeriesImpl);