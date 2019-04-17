import {forwardRef, RefObject} from 'react';
import {useChain} from '../hooks/useChain';
import {useNode} from '../hooks/useNode';

// example of wrapping a single AudioNode in a component
export const Gain = forwardRef((props: object, ref: RefObject<any>) => {
  const node = useNode(GainNode); // get an AudioNode somehow

  useChain(ref, node, node);

  return null;
});

