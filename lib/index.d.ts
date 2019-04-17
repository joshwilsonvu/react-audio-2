/// <reference types="react" />
declare const _default: {
    useChain: (ref: import("react").RefObject<import("./hooks/useChain").Chain>, input?: AudioNode | AudioParam | (AudioNode | AudioParam)[] | null | undefined, output?: AudioNode | AudioNode[] | null | undefined) => void;
    useChildRefs: (children: any) => {
        reffedChildren: import("react").ReactElement<any, string | ((props: any) => import("react").ReactElement<any, string | any | (new (props: any) => import("react").Component<any, any, any>)> | null) | (new (props: any) => import("react").Component<any, any, any>)>[];
        refs: import("react").RefObject<import("./hooks/useChain").Chain>[];
    };
    useNode: (Class: import("./hooks/useNode").NodeClass) => AudioNode;
    AudioProvider: ({ children, context }: {
        children: any;
        context?: BaseAudioContext | undefined;
    }) => JSX.Element;
    useAudioContext: () => BaseAudioContext;
    Series: import("react").ForwardRefExoticComponent<{
        children: any;
    } & import("react").RefAttributes<import("./hooks/useChain").Chain>>;
    Parallel: import("react").ForwardRefExoticComponent<{
        children: any;
    } & import("react").RefAttributes<any>>;
    Gain: import("react").ForwardRefExoticComponent<object & import("react").RefAttributes<any>>;
};
export default _default;
