declare module 'signature_pad' {
  export type Options = {
    backgroundColor?: string;
    penColor?: string;
    minWidth?: number;
    maxWidth?: number;
  };

  export default class SignaturePad {
    constructor(
      canvas: HTMLCanvasElement,
      options?: Options,
    );

    clear(): void;
    isEmpty(): boolean;
    toDataURL(type?: string): string;
    off(): void;
  }
}
