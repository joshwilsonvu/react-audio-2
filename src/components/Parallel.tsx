import * as React from 'react';
import {forwardRef, RefObject} from 'react';
import {use} from '../hooks/useIO';

// Usage
// <Parallel>    <Parallel>
//   <Source>...   <Effect/>...
// </Parallel>   </Parallel>
const ParallelImpl = (props: {children: any}) => {


  useChain(ref, refs.flatMap(ref => ref.input), refs.flatMap(ref => ref.output));

  return <>{reffedChildren}</>;
};

export const Parallel = forwardRef(ParallelImpl);