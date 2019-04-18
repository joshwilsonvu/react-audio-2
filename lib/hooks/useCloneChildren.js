import * as React from 'react';
import { useMemo } from 'react';
function isFunProps(props) {
    return typeof (props) === 'function';
}
// add props to props.children, takes object or function form that gets current ReactElement
export const useCloneChildren = (children, props) => (useMemo(() => (React.Children.map(children, (current, index) => (React.cloneElement(current, isFunProps(props) ? props(current, index) : props)))), [children]));
//# sourceMappingURL=useCloneChildren.js.map