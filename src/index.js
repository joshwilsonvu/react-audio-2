import React, {
  forwardRef,
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  useMemo,
  createContext,
  useContext
} from 'react';


const makeArray = val => val ? (Array.isArray(val) ? val : [val]) : [];

// pairwise connect all combinations of output and input nodes
const connectNodes = (output, input) => {
  for (let o of output) {
    for (let i of input) {
      o.connect(i);
    }
  }
};

// undo connectNodes()
const disconnectNodes = (output, input) => {
  for (let o of output) {
    for (let i of input) {
      o.disconnect(i);
    }
  }
};

/*
const usePrevious = (value, init = null) => {
  const ref = useRef(init);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};
*/

// Call this private hook to let a node be connected to other nodes
const useChain = (ref, input, output) => {
  input = useMemo(() => makeArray(input), [input]);
  output = useMemo(() => makeArray(output), [output]);
  const [next, setNext] = useState(null);
  const nextInput = next && next.input;
  useEffect(() => {
    if (!nextInput) {
      throw new Error(`Attempted to connect to a node without an input`);
    }
    if (!output) {
      throw new Error(`Attempted to connect without having an output`);
    }
    connectNodes(output, nextInput);
    return () => {
      disconnectNodes(output, nextInput);
    };
  }, [nextInput, output]);
  useImperativeHandle(ref, () => ({
    input,
    setNext
  }), [input, setNext]);
};

// add refs to props.children
const useChildRefs = (children) => {
  return useMemo(() => {
    const refs = [];
    const reffedChildren = React.Children.map(children, current => {
      const ref = React.createRef();
      refs.push(ref);
      return React.cloneElement(current, {ref});
    });
    return {reffedChildren, refs};
  }, [children]);
};

// Usage
// <Series>
//   <Source>?
//   <Effect>...
// </Series>
const SeriesImpl = ({children}, ref) => {
  const {reffedChildren, refs} = useChildRefs(children);

  // Call setNext() on each node with the following node. No cleanup, handled in useChain
  useEffect(() => {
    refs.reduce((childRef, nextRef) => {
      childRef.current.setNext(nextRef.current);
      return nextRef;
    });
  }, [refs]);

  useChain(ref, refs[0].current.input, refs[refs.length - 1].current.output);

  return <>{reffedChildren}</>;
};

export const Series = forwardRef(SeriesImpl);

// Usage
// <Parallel>    <Parallel>
//   <Source>...   <Effect/>...
// </Parallel>   </Parallel>
const ParallelImpl = ({children}, ref) => {
  const {reffedChildren, refs} = useChildRefs(children);

  useChain(ref, refs.map(ref => ref.input).flat(), refs.map(ref => ref.output).flat());

  return <>{reffedChildren}</>;
};

export const Parallel = forwardRef(ParallelImpl);

// private component helper for AudioContext
const DestinationImpl = (props, ref) => {
  const input = useAudioContext().destination;

  useChain(ref, input);

  return null;
};

const Destination = forwardRef(DestinationImpl);

const ReactAudioContext = createContext();

export const useAudioContext = () => {
  return useContext(ReactAudioContext);
};

// Reuses Series but route it to the context's destination
const WrappedAudio = ({children, context}) => (
  <ReactAudioContext.Provider value={context}>
    <Series>
      {children}
      <Destination context={context}/>
    </Series>
  </ReactAudioContext.Provider>
);

export const Audio = ({children, context}) => {
  const contextRef = useRef(context || new (window.AudioContext || window.webkitAudioContext)());
  useEffect(() => () => {
    contextRef.current && contextRef.current.close();
  }, []);
  return (
    <WrappedAudio>
      {children}
    </WrappedAudio>
  )
};

