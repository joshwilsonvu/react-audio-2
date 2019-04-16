

// example of wrapping a single AudioNode in a component
import {forwardRef, useRef} from 'react';

const BasicNode = forwardRef(({context}, ref) => {
  const node = useRef(); // get an AudioNode somehow

  useChain(node, node, ref);
});