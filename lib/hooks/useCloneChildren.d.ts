import * as React from 'react';
import { ReactElement } from 'react';
interface FunProps {
    (e?: ReactElement, index?: number): object;
}
export declare const useCloneChildren: (children: any, props: object | FunProps) => React.DetailedReactHTMLElement<object, HTMLElement>[];
export {};
