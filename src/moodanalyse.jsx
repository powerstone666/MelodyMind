import React, { useRef, useEffect } from 'react';
import useMediaQuery from './useMedia';
import * as faceapi from 'face-api.js';

function Moodanalyse() {
  const isAboveMedium = useMediaQuery("(min-width: 768px)");
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    startVideo();
    loadModels();
  }, []);

  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true; // Ensure muted for autoplay
        videoRef.current.play().catch(err => console.error("Error playing video:", err));
      }
    } catch (err) {
      console.error("Error accessing media devices:", err);
    }
  };
  
  const loadModels = async () => {
    try {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
        faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
        faceapi.nets.faceExpressionNet.loadFromUri("/models")
      ]);
      console.log("Models loaded successfully.");
      faceMyDetect();
    } catch (err) {
      console.error("Error loading models:", err);
    }
  };

  const faceMyDetect = async () => {
    try {
      setInterval(async () => {
        if (!videoRef.current || !canvasRef.current) return;

        const detections = await faceapi.detectAllFaces(videoRef.current,
          new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();

        if (detections.length > 0) {
          const displaySize = { width: videoRef.current.videoWidth, height: videoRef.current.videoHeight };

          canvasRef.current.width = displaySize.width;
          canvasRef.current.height = displaySize.height;

          const context = canvasRef.current.getContext('2d');
          context.clearRect(0, 0, displaySize.width, displaySize.height);

          const resizedDetections = faceapi.resizeResults(detections, displaySize);

          faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
          faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
          faceapi.draw.drawFaceExpressions(canvasRef.current, resizedDetections);

          // Log expression results
          resizedDetections.forEach(result => {
            const expressions = result.expressions;
            console.log("Expression results:", expressions);
          });
        }
      }, 100); // Adjust the interval as needed
    } catch (err) {
      console.error("Error detecting faces:", err);
    }
  };

  return (
    <div>
      {isAboveMedium ? (
        <div className="h-screen flex flex-col items-center overflow-y-scroll">
          <div>
            <h1 className='text-2xl text-red mt-8'>Let Your Mood Sing For You</h1>
          </div>
          <div className='w-screen h-screen flex'>
            <div className='w-1/2 p-4 h-screen relative'>
              <h1 className='text-blue text-2xl'>Face Detection</h1>
              <video ref={videoRef} autoPlay muted style={{ height: "600px", width: "800px" }}></video>
              <canvas ref={canvasRef} muted className='absolute top-0 left-0'></canvas>
            </div>
            <div className='w-1/2'></div>
          </div>
        </div>
      ) : (
        <div className="h-screen flex flex-col items-center overflow-y-scroll">
          <div>
            <h1 className='text-2xl text-red mt-8'>Let Your Mood Sing For You</h1>
          </div>
          <div className='w-screen h-screen flex'>
            <div className='w-1/2 p-4 h-screen relative'>
              <h1 className='text-blue text-2xl'>Face Detection</h1>
              <video ref={videoRef} autoPlay muted playsInline style={{ height: "600px", width: "800px" }}></video>

              <canvas ref={canvasRef} autoPlay muted playsInline className='absolute top-0 left-0'></canvas>
            </div>
            <div className='w-1/2'></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Moodanalyse;
