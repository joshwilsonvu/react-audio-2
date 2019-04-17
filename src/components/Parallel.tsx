import * as React from 'react';
import {forwardRef, RefObject} from 'react';
import {useChain} from '../hooks/useChain';
import {useChildRefs} from '../hooks/useChildRefs';

// Usage
// <Parallel>    <Parallel>
//   <Source>...   <Effect/>...
// </Parallel>   </Parallel>
const ParallelImpl = ({children}: {children: any}, ref: RefObject<any>) => {
  const {reffedChildren, refs} = useChildRefs(children);

  useChain(ref, refs.flatMap(ref => ref.input), refs.flatMap(ref => ref.output));

  return <>{reffedChildren}</>;
};

export const Parallel = forwardRef(ParallelImpl);