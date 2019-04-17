import { useEffect, useMemo, useState, useImperativeHandle } from 'react';
const makeArray = (val) => val ? (Array.isArray(val) ? val : [val]) : [];
// pairwise connect all combinations of output and input nodes
const connectNodes = (output, input) => {
    for (let o of output) {
        for (let i of input) {
            // @ts-ignore connect should accept both AudioNode and AudioParam
            o.connect(i);
        }
    }
};
// undo connectNodes()
const disconnectNodes = (output, input) => {
    for (let o of output) {
        for (let i of input) {
            // @ts-ignore disconnect should accept both AudioNode and AudioParam
            o.disconnect(i);
        }
    }
};
const useChain2 = ({ next, setInput }, input, output) => {
    let i = useMemo(() => makeArray(input), [input]);
    let o = useMemo(() => makeArray(output), [output]);
    setInput(i);
    useEffect(() => {
        connectNodes(o, next);
        return () => {
            disconnectNodes(o, next);
        };
    }, [next]);
};
// Call this private hook to let a node be connected to other nodes
export const useChain = (ref, input, output) => {
    let i = useMemo(() => makeArray(input), [input]);
    let o = useMemo(() => makeArray(output), [output]);
    const [next, setNext] = useState(null);
    const nextInput = next && next.input;
    useEffect(() => {
        if (!nextInput) {
            throw new Error(`Attempted to connect to a node without an input`);
        }
        connectNodes(o, nextInput);
        return () => {
            disconnectNodes(o, nextInput);
        };
    }, [nextInput, o]);
    useImperativeHandle(ref, () => ({
        input: i,
        output: o,
        setNext
    }), [i, o, setNext]);
};
//# sourceMappingURL=useChain.js.map