import * as React from 'react';
import {Children, forwardRef, RefObject, useCallback, useEffect, useState} from 'react';
import {useChain, Chain} from '../hooks/useChain';
import {useChildCallbackRefs} from '../hooks/useChildRefs';
import {useSeries} from '../hooks/useSeries';

// Usage
// <Series>
//   <Source>?
//   <Effect>...
// </Series>
const SeriesImpl = ({children}: {children: any}, ref: RefObject<Chain>) => {
  const {reffedChildren, nodeArray} = useSeries(children);

  // Call setNext() on each node with the following node. No cleanup, handled in useChain()
  useEffect(() => {
    nodeArray.reduce((child, next) => {
      if (child && next) {
        child.setNext(next);
      }
      return next;
    });
  }, [nodeArray]);

  const first = nodeArray[0], last = nodeArray[nodeArray.length - 1];
  useChain(ref, first && first.input, last && last.output);

  return <>{reffedChildren}</>;
};

export const Series = forwardRef(SeriesImpl);