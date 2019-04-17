import {useState} from 'react';
import {useAudioContext} from '../components/Audio';

export interface NodeClass {
  new (context: BaseAudioContext, ...rest: any[]): AudioNode
}

export const useNode = (Class: NodeClass): AudioNode => {
  const audioContext = useAudioContext();
  const [node] = useState(() => new Class(audioContext));
  return node;
};

