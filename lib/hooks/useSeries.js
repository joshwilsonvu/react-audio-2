import { Children, useCallback, useReducer } from 'react';
import { useChildCallbackRefs } from './useChildRefs';
const makeReducer = (count) => {
    let temp = [];
    return (state, action) => {
        temp.push(action);
        if (temp.length === count) {
            state = temp.sort((a, b) => a.key - b.key).map(e => e.node);
            temp = [];
        }
        return state;
    };
};
// reffedChildren is all or nothing--sets when the children are mounted
export const useSeries = (children) => {
    const [nodeArray, dispatch] = useReducer(makeReducer(Children.count(children)), []);
    const callbackRef = useCallback((node, key) => {
        dispatch({ node, key });
    }, [children]);
    const reffedChildren = useChildCallbackRefs(children, callbackRef);
    return { reffedChildren, nodeArray };
};
//# sourceMappingURL=useSeries.js.map