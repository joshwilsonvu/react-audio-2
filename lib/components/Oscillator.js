import { useInput, useOutput } from '../hooks/useIO';
import { useNode } from '../hooks/useNode';
// example of wrapping a single AudioNode in a component
export const Gain = (props) => {
    const node = useNode(OscillatorNode); // get an AudioNode somehow
    useInput(node, props);
    useOutput(node, props);
    return null;
};
//# sourceMappingURL=Oscillator.js.map