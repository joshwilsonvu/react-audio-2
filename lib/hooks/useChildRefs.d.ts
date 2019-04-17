import * as React from 'react';
import { Chain } from './useChain';
export declare const useChildRefs: (children: any) => {
    reffedChildren: React.ReactElement<any, string | ((props: any) => React.ReactElement<any, string | any | (new (props: any) => React.Component<any, any, any>)> | null) | (new (props: any) => React.Component<any, any, any>)>[];
    refs: React.RefObject<Chain>[];
};
declare type ChildCallbackRef = (node: Chain, index: number) => any;
export declare const useChildCallbackRefs: (children: any, callback: ChildCallbackRef) => React.ReactElement<any, string | ((props: any) => React.ReactElement<any, string | any | (new (props: any) => React.Component<any, any, any>)> | null) | (new (props: any) => React.Component<any, any, any>)>[];
export {};
