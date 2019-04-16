import React, {useRef, Children, useEffect, useImperativeHandle, forwardRef} from 'react';

/*
const usePrevious = value => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

const useConnect = (ref, next) => {
  if (next !== prevNext) {

  }

  useImperativeHandle(ref, () => ({
    connect: next => {

    },
    disconnect: next => {

    },
    first: () => {

    }
  }), []);
};

const useNode = (type, ...args) => {
  return useRef(new type());
};

const Node = ({next, type}) => {
  const prevNext = usePrevious(next);
  const node = useNode(type);
  useEffect(() => {
    if (next !== prevNext) {

    }
  }, [next]);
};

const Series = ({children, context}) => {
  const childArray = Children.toArray(children);
  for (let i = 1; i < childArray.length; ++i) {
    const next =
  }

  return null; // TODO
};


const AudioContext = ({children, context}) => {
  const audioRef = useRef(context || new AudioContextClass());

  return <Series context={context}>{children}</Series>
};
*/

const DestImpl = ({context}, ref) => {
  const input = context.destination;
  useChain(input, null, ref);

  return null;
};

// private component helper for AudioContext
const Destination = forwardRef(DestImpl);

// Reuses Series but route it to the context's destination
const Audio = ({children, context}) => (
  <Series>
    {children}
    <Destination context={context}/>
  </Series>
);



export default Audio;