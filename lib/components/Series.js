import * as React from 'react';
import { forwardRef, useEffect } from 'react';
import { useChain } from '../hooks/useChain';
import { useSeries } from '../hooks/useSeries';
// Usage
// <Series>
//   <Source>?
//   <Effect>...
// </Series>
const SeriesImpl = ({ children }, ref) => {
    const { reffedChildren, nodeArray } = useSeries(children);
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
    return React.createElement(React.Fragment, null, reffedChildren);
};
export const Series = forwardRef(SeriesImpl);
//# sourceMappingURL=Series.js.map