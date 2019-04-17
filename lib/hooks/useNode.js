import { useState } from 'react';
import { useAudioContext } from '../components/Audio';
export const useNode = (Class) => {
    const audioContext = useAudioContext();
    const [node] = useState(() => new Class(audioContext));
    return node;
};
//# sourceMappingURL=useNode.js.map