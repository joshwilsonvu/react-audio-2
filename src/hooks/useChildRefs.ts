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
