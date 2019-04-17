/// <reference types="react" />
import { Chain } from './useChain';
export declare const useSeries: (children: any) => {
    reffedChildren: import("react").ReactElement<any, string | ((props: any) => import("react").ReactElement<any, string | any | (new (props: any) => import("react").Component<any, any, any>)> | null) | (new (props: any) => import("react").Component<any, any, any>)>[];
    nodeArray: Chain[];
};
