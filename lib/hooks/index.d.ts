declare const _default: {
    useInput: (input: AudioNode | AudioParam | (AudioNode | AudioParam)[] | Promise<AudioNode | AudioParam | (AudioNode | AudioParam)[]>, { resolveInput }: import("./useIO").UseInputProps) => void;
    useOutput: (output: AudioNode | AudioNode[] | Promise<AudioNode | AudioNode[]>, { resolveOutput, getNext }: import("./useIO").UseOutputProps) => void;
    useNode: (Class: import("./useNode").NodeClass) => AudioNode;
};
export default _default;
