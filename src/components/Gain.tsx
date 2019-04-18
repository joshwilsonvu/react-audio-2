import {useInput, useOutput} from '../hooks/useIO';
import {useNode} from '../hooks/useNode';

// example of wrapping a single AudioNode in a component
export const Gain = (props: object) => {
  const node = useNode(GainNode); // get an AudioNode somehow

  useInput(node, props);
  useOutput(node, props);

  return null;
};

