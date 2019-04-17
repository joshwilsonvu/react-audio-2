import {Children, useCallback, useReducer, useState} from 'react';
import {Chain} from './useChain';
import {useChildCallbackRefs} from './useChildRefs';

interface Entry {
  key: number,
  node: Chain
}

const makeReducer = (count: number) => {
  let temp: Entry[] = [];
  return (state: Chain[], action: Entry) => {
    temp.push(action);
    if (temp.length === count) {
      state = temp.sort((a, b) => a.key - b.key).map(e => e.node);
      temp = [];
    }
    return state;
  };
};

// reffedChildren is all or nothing--sets when the children are mounted
export const useSeries = (children: any) => {
  const [nodeArray, dispatch] = useReducer(makeReducer(Children.count(children)), []);

  const callbackRef = useCallback((node, key) => {
    dispatch({node, key});
  }, [children]);

  const reffedChildren = useChildCallbackRefs(children, callbackRef);

  return {reffedChildren, nodeArray};
};

