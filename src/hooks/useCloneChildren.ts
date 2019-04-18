import * as React from 'react';
import {ReactElement, useMemo} from 'react';

interface FunProps {
  (e?: ReactElement, index?: number): object
}

function isFunProps(props: object | FunProps): props is FunProps {
  return typeof(props) === 'function';
}

// add props to props.children, takes object or function form that gets current ReactElement
export const useCloneChildren = (children: any, props: object | FunProps) => (
  useMemo(() => (
    React.Children.map(children, (current, index) => (
      React.cloneElement(current, isFunProps(props) ? props(current, index) : props)
    ))
  ), [children])
);