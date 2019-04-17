import * as React from 'react';
import { useMemo } from 'react';
// add refs to props.children
export const useChildRefs = (children) => {
    return useMemo(() => {
        const refs = [];
        const reffedChildren = React.Children.map(children, (current) => {
            const ref = React.createRef();
            refs.push(ref);
            return React.cloneElement(current, { ref });
        });
        return { reffedChildren, refs };
    }, [children]);
};
export const useChildCallbackRefs = (children, callback) => {
    return useMemo(() => (React.Children.map(children, (current, index) => (React.cloneElement(current, {
        ref: function (node) {
            callback(node, index);
        }
    })))), [children, callback]);
};
//# sourceMappingURL=useChildRefs.js.map