import { useCallback, useEffect, useRef, useState } from 'react';
// if not an array, make it an array
const makeArray = (val) => val ? (Array.isArray(val) ? val : [val]) : [];
// pairwise connect all combinations of output and input nodes
const connectNodes = (output, input) => {
    const inArr = makeArray(input);
    const outArr = makeArray(output);
    for (let o of outArr) {
        for (let i of inArr) {
            // @ts-ignore connect should accept both AudioNode and AudioParam
            o.connect(i);
        }
    }
};
// undo connectNodes()
const disconnectNodes = (output, input) => {
    const inArr = makeArray(input);
    const outArr = makeArray(output);
    for (let o of outArr) {
        for (let i of inArr) {
            // @ts-ignore disconnect should accept both AudioNode and AudioParam
            o.disconnect(i);
        }
    }
};
// When the promise resolves (or a plain value is given), execute the callback with the result.
// Memoizing the callback is not strictly required but helps.
const usePromiseResult = (promise, callback) => {
    const callbackRef = useRef();
    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);
    useEffect(() => {
        let cancelled = false;
        Promise.resolve(promise).then(value => {
            !cancelled && callbackRef.current && callbackRef.current(value);
        });
        return () => {
            cancelled = true;
        };
    }, [promise]);
};
export const useInput = (input, { resolveInput }) => {
    usePromiseResult(input, resolveInput);
};
/**
 * Hooks up a node so that it is connectable to the next node.
 * @param output an AudioNode, array of AudioNodes, or a promise resolving to one of these from a child node
 * @param resolveOutput call this with output
 * @param getNext a promise resolving to the next node's input
 */
export const useOutput = (output, { resolveOutput, getNext }) => {
    const [next, setNext] = useState([]);
    const [cachedOutput, setCachedOutput] = useState([]);
    const handleOutput = useCallback((output) => {
        setCachedOutput(output);
    }, [resolveOutput]);
    usePromiseResult(output, handleOutput);
    usePromiseResult(getNext, setNext);
    useEffect(() => {
        resolveOutput && resolveOutput(cachedOutput);
    }, [cachedOutput]);
    useEffect(() => {
        connectNodes(cachedOutput, next);
        return () => {
            disconnectNodes(cachedOutput, next);
        };
    }, [cachedOutput, next]);
};
//# sourceMappingURL=useIO.js.map