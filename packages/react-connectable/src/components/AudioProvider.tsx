import * as React from 'react';
import {createContext, forwardRef, useContext, useState} from 'react';
import 'webaudioapi';
import {useInput, UseInputProps} from '../hooks/useIO';
import {Series} from './Series';

// private component helper for AudioContext
const DestinationImpl = (props: UseInputProps): null => {
  const input = useAudioContext().destination;

  useInput(input, props);

  return null;
};

const Destination = React.memo(DestinationImpl);

const ReactAudioContext = createContext<BaseAudioContext|null>(null);

export const useAudioContext = (): BaseAudioContext => {
  return useContext(ReactAudioContext)!;
};

// Reuses Series but route it to the context's destination
export const AudioProvider = ({children, context}: {children: any, context?: BaseAudioContext}) => {
  const [audioContext] = useState(() => context || new ((window as any).AudioContext || ((window as any).webkitAudioContext))() as AudioContext);
  return (
    <ReactAudioContext.Provider value={audioContext}>
      <Series>
        {children}
        <Destination/>
      </Series>
    </ReactAudioContext.Provider>
  );
};
