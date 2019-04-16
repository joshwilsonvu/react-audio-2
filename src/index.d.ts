declare module index {

  type Input = AudioNode|AudioParam;
  type Output = AudioNode;

  interface IFrom {
    input: Input|Array<Input>,
    output: Output|Array<Output>
  }

  declare function useChain (from: IFrom, register: ({input: Array<Input>, output: Array<Output>}) => void): void;


}