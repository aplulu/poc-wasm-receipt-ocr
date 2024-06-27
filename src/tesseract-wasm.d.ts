declare module 'tesseract-wasm' {
  export class OCRClient {
    loadModel(model: string): Promise<void>;
    loadImage(image: ImageBitmap): Promise<void>;
    getText(): Promise<string>;
  }
}
