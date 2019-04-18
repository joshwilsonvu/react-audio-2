import * as React from 'react';
import { forwardRef } from 'react';
// Usage
// <Parallel>    <Parallel>
//   <Source>...   <Effect/>...
// </Parallel>   </Parallel>
const ParallelImpl = (props) => {
    useChain(ref, refs.flatMap(ref => ref.input), refs.flatMap(ref => ref.output));
    return React.createElement(React.Fragment, null, reffedChildren);
};
export const Parallel = forwardRef(ParallelImpl);
//# sourceMappingURL=Parallel.js.map