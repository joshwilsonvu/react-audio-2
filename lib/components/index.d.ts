/// <reference types="react" />
declare const _default: {
    AudioProvider: ({ children, context }: {
        children: any;
        context?: BaseAudioContext | undefined;
    }) => JSX.Element;
    useAudioContext: () => BaseAudioContext;
    Series: import("react").ForwardRefExoticComponent<{
        children: any;
    } & import("react").RefAttributes<import("../hooks/useChain").Chain>>;
    Parallel: import("react").ForwardRefExoticComponent<{
        children: any;
    } & import("react").RefAttributes<any>>;
    Gain: import("react").ForwardRefExoticComponent<object & import("react").RefAttributes<any>>;
};
export default _default;
