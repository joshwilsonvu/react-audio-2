/// <reference types="react" />
declare const _default: {
    useChain: (ref: import("react").RefObject<import("./useChain").Chain>, input?: AudioNode | AudioParam | (AudioNode | AudioParam)[] | null | undefined, output?: AudioNode | AudioNode[] | null | undefined) => void;
    useChildRefs: (children: any) => {
        reffedChildren: import("react").ReactElement<any, string | ((props: any) => import("react").ReactElement<any, string | any | (new (props: any) => import("react").Component<any, any, any>)> | null) | (new (props: any) => import("react").Component<any, any, any>)>[];
        refs: import("react").RefObject<import("./useChain").Chain>[];
    };
    useNode: (Class: import("./useNode").NodeClass) => AudioNode;
};
export default _default;
