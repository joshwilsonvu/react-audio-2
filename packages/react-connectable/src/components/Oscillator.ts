import {Input, Output, useInput, useOutput} from '../hooks/useIO';
import {NodeClass, useNode} from '../hooks/useNode';

const makeSource = <Params>(Class: NodeClass, params: Params) => {


  return (props: Params) => {
    useOutput()
  }
};

const makeProcessor = <P>(Class: NodeClass) => {
  let params: AudioParam[] = [];


  return (props: P & UseInputProps) => {
    let node: Input & Output = useNode(Class);


    useInput(node.numberOfInputs ? node : [], props);
    useOutput();
  }
};

interface OscillatorProps {
  frequency: number,
  oscillatorType: "sine" | "square" | "sawtooth" | "triangle" | "custom",
  periodicWave?: PeriodicWave
}

export const Oscillator = makeProcessor<OscillatorProps>()

/*
// example of wrapping a single AudioNode in a component
export const Oscillator = (props: object) => {
  const node = useNode(OscillatorNode);
  node.

  useInput(node, props);
  useOutput(node, props);

  return null;
};

*/