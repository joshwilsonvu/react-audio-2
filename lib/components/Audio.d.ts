/// <reference types="react" />
import 'webaudioapi';
export declare const useAudioContext: () => BaseAudioContext;
export declare const AudioProvider: ({ children, context }: {
    children: any;
    context?: BaseAudioContext | undefined;
}) => JSX.Element;
