import React, {useRef, Children, useEffect, useImperativeHandle, forwardRef} from 'react';

const AudioContextClass = window.AudioContext || window.webkitAudioContext;

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
  const typeRef = useRef();
  useEffect(() => {
    typeRef.current = new type();
    return () => {
      typeRef.current = null;
    }
  })


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

export default AudioContext;