import * as React from 'react';
import { forwardRef } from 'react';
import { useChain } from '../hooks/useChain';
import { useChildRefs } from '../hooks/useChildRefs';
// Usage
// <Parallel>    <Parallel>
//   <Source>...   <Effect/>...
// </Parallel>   </Parallel>
const ParallelImpl = ({ children }, ref) => {
    const { reffedChildren, refs } = useChildRefs(children);
    useChain(ref, refs.flatMap(ref => ref.input), refs.flatMap(ref => ref.output));
    return React.createElement(React.Fragment, null, reffedChildren);
};
export const Parallel = forwardRef(ParallelImpl);
//# sourceMappingURL=Parallel.js.map