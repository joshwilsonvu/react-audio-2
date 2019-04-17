export interface NodeClass {
    new (context: BaseAudioContext, ...rest: any[]): AudioNode;
}
export declare const useNode: (Class: NodeClass) => AudioNode;
