import * as React from 'react';
import {Children, cloneElement, memo, useMemo} from 'react';
import {Input, Output, useIO, UseIOProps} from '../hooks/useIO';

const parallelizeChildren = (children: any, getNext?: PromiseLike<Input>) => {
  const getInputs: PromiseLike<Input>[] = [];
  const getOutputs: PromiseLike<Output>[] = [];
  const childArray = Children.map(children, child => {
    let resolveInput, resolveOutput;
    getInputs.push(new Promise(resolve => {
      resolveInput = resolve;
    }));
    getOutputs.push(new Promise(resolve => {
      resolveOutput = resolve;
    }));
    return cloneElement(child, {
      getNext,
      resolveInput,
      resolveOutput
    });
  });
  return {
    getInputs,
    getOutputs,
    childArray,
  }
};

// Usage
// <Parallel>    <Parallel>
//   <Source>...   <Effect/>...
// </Parallel>   </Parallel>
const ParallelImpl = (props: {children: any} & UseIOProps) => {
  const {childArray, getInputs, getOutputs} = useMemo(() => {
    return parallelizeChildren(props.children, props.getNext);
  }, [props.children, props.getNext]);

  // flatten promise results to handle nested Parallels
  const input = useMemo(() => {
    return Promise.all(getInputs).then(inputs => inputs.flat());
  }, [getInputs]);
  const output = useMemo(() => {
    return Promise.all(getOutputs).then(outputs => outputs.flat());
  }, [getOutputs]);

  useIO(input, output, props);

  return <>{childArray}</>;
};

export const Parallel = memo(ParallelImpl);