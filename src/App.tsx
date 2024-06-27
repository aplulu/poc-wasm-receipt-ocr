import { Box, VStack, Text } from '@kuma-ui/core';
import { Header } from './components/header';
import { useRef, useState } from 'react';
import { OCRClient } from 'tesseract-wasm';
import { Divider } from './components/divider';
import { Button } from './components/button';

function App() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [error, setError] = useState<string | undefined>();
  const [dataImage, setDataImage] = useState<string | undefined>();
  const [text, setText] = useState<string | undefined>();
  const [isCapturing, setIsCapturing] = useState<boolean>(false);

  const handleVideoCanPlay = () => {
    setIsCapturing(true);
  };

  const handleLoadSampleImage = async () => {
    try {
      const resp = await fetch('/sample-receipt.jpg');
      const blob = await resp.blob();
      const image = await createImageBitmap(blob);

      const reader = new FileReader();
      reader.onload = () => {
        setDataImage(reader.result as string);
      };
      reader.readAsDataURL(blob);

      const oc = new OCRClient();
      await oc.loadModel('jpn.traineddata');
      await oc.loadImage(image);

      const text = await oc.getText();

      console.log(text);

      setText(text);
    } catch (err) {
      console.error(err);
      setError('画像の読み込みに失敗しました');
    }
  };

  const handleLoadUserMedia = async () => {
    if (!videoRef.current) {
      throw new Error('video element not found');
    }

    if (isCapturing) {
      videoRef.current.removeEventListener('canplay', handleVideoCanPlay);
      setIsCapturing(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
        },
      });

      videoRef.current.srcObject = stream;

      videoRef.current.addEventListener('canplay', handleVideoCanPlay);
    } catch (err) {
      setIsCapturing(false);
      console.error(err);
      setError('動画の取得に失敗しました');
    }
  };

  const takePicture = async () => {
    if (!videoRef.current) {
      throw new Error('video element not found');
    }

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('context not found');
    }

    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/jpeg');
    setDataImage(dataUrl);

    const image = await createImageBitmap(canvas);

    const oc = new OCRClient();
    await oc.loadModel('jpn.traineddata');
    await oc.loadImage(image);

    const text = await oc.getText();

    console.log(text);

    setText(text);

    videoRef.current.removeEventListener('canplay', handleVideoCanPlay);
    setIsCapturing(false);
  };

  return (
    <VStack>
      <Header />
      <VStack as="main" gap={24} px={24} py={12} alignItems="center">
        {error && (
          <Box color="red" fontSize="1rem" fontWeight="bold">
            {error}
          </Box>
        )}

        <VStack as="section" maxWidth={600} gap={24}>
          <Button onClick={handleLoadSampleImage}>サンプル画像読み込み</Button>
          <Button onClick={handleLoadUserMedia}>カメラ</Button>

          <Box display={isCapturing ? 'block' : 'none'} gap={4}>
            <Text>カメラ画像取得中...</Text>
            <video
              ref={videoRef}
              width="640"
              height="480"
              autoPlay
              playsInline
              muted
            />

            <Button onClick={takePicture}>撮影</Button>
          </Box>
        </VStack>

        {dataImage && (
          <>
            <Divider />
            <Box>
              <Text>読み込み画像</Text>

              <img src={dataImage} alt="data" />
            </Box>
          </>
        )}

        {text && (
          <>
            <Divider />
            <Box>
              <Text>OCR結果</Text>
              <Text as="pre">{text}</Text>
            </Box>
          </>
        )}
      </VStack>
    </VStack>
  );
}

export default App;
