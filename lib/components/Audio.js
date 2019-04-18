import * as React from 'react';
import { forwardRef, useState, createContext, useContext } from 'react';
import 'webaudioapi';
import { useInput } from '../hooks/useIO';
import { Series } from './Series';
// private component helper for AudioContext
const DestinationImpl = (props) => {
    const input = useAudioContext().destination;
    useInput(input, props);
    return null;
};
const Destination = forwardRef(DestinationImpl);
const ReactAudioContext = createContext(null);
export const useAudioContext = () => {
    return useContext(ReactAudioContext);
};
// Reuses Series but route it to the context's destination
export const AudioProvider = ({ children, context }) => {
    const [audioContext] = useState(() => context || new (window.AudioContext || (window.webkitAudioContext))());
    return (React.createElement(ReactAudioContext.Provider, { value: audioContext },
        React.createElement(Series, null,
            children,
            React.createElement(Destination, null))));
};
//# sourceMappingURL=Audio.js.map