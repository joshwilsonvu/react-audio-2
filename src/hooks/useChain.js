import React, {useEffect, useContext, createContext} from 'react';

/*
const makeArray = val => val ? (Array.isArray(val) ? val : [val]) : [];

// add refs to props.children
const getChildRefs = (children) => {
  const refs = [];
  children = React.Children.map(children, current => {
    const ref = React.createRef();
    refs.push(ref);
    return React.cloneElement(current, { ref });
  });
  return { children, refs };
};

// Call this private hook to let a node be connected to other nodes
const useChain = (inputs, outputs, register) => {
  inputs = makeArray(inputs);
  outputs = makeArray(outputs);
  useEffect(() => {
    register({inputs, outputs});
    return () => register(null, null);
  }, [inputs, outputs]);
};

export default useChain;
*/