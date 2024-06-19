import React, { useRef, useEffect, useState } from 'react';
import useMediaQuery from './useMedia';
import * as faceapi from 'face-api.js';
import { songBymood } from './saavnapi';
import he from 'he';
function Moodanalyse() {
  const isAboveMedium = useMediaQuery("(min-width: 768px)");
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [dominantExpression, setDominantExpression] = useState(null);
  const [musicInfo, setMusicInfo] = useState([]);
  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      startVideo();
      loadModels();
    } else {
      console.error("getUserMedia is not supported in this browser.");
    }
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

          // Get and store the dominant expression of the first detected face
          const firstDetection = resizedDetections[0];
          if (firstDetection) {
            const expressions = firstDetection.expressions;
            const dominant = Object.keys(expressions).reduce((a, b) => expressions[a] > expressions[b] ? a : b);
            setDominantExpression(dominant);
          }
        }
      }, 100); // Adjust the interval as needed
    } catch (err) {
      console.error("Error detecting faces:", err);
    }
  };
  useEffect(() => {
    let intervalId;

    if (dominantExpression) {
      const fetchSong = async () => {
        try {
          const res = await songBymood(dominantExpression);
          setMusicInfo(
            res.data.data.results.map((song) => ({
              id: song.id,
              name: he.decode(song.name),
              image: song.image[1],
              artist: song.artists.primary[0].name,
              year: song.year,
            }))
          );
        } catch (err) {
          console.error("Error fetching song:", err);
        }
      };

      fetchSong();
      intervalId = setInterval(fetchSong, 30000);
    }
    return () => clearInterval(intervalId);
  }, [dominantExpression]);

  return (
    <div>
      {isAboveMedium ? (
        <div className="h-screen flex flex-col items-center overflow-y-scroll overflow-x-hidden">
          <div>
            <h1 className='text-2xl text-red mt-8'>Let Your Mood Sing For You</h1>
          </div>
          <div className='w-screen h-screen flex'>
            <div className='w-1/3 p-4 h-screen relative'>
              <h1 className='text-blue text-2xl'>Face Detection</h1>
              <video ref={videoRef} autoPlay muted style={{ height: "600px", width: "800px" }}></video>
              <canvas ref={canvasRef} className='absolute top-0 left-0'></canvas>
            </div>
            <div className='w-2/3 '>
            {musicInfo.slice(0, 10).map((song, index) => (
                 <div
                 className="w-4/6 bg-deep-grey flex items-center gap-8 p-4 m-5 cursor-pointer"
                 key={song.id}
                 onClick={() => play(song.id)}
               >
                 <h1 className="text-md w-12">#{index + 1}</h1>{" "}
                 {/* Fixed width for index */}
                 <img src={song.image.url} className="h-12" />{" "}
                 {/* Keep image size fixed */}
                 <h1 className="text-mdflex-grow">{song.year}</h1>{" "}
                 {/* Allow year to take remaining space */}
                 <h1 className="text-md flex-grow">{song.name}</h1>
                {" "}
                 {/* Keep image size fixed */}
               </div>
              ))}
            </div>
          </div>
          <div className='mb-48'>
            </div>
        </div>
      ) : (
       <div className='h-screen flex-col flex-wrap items-center overflow-y-scroll justify-center'>
            <h1 className='text-red ml-12 text-xl'>Let Your Mood Sing For You</h1>
            <div style={{ position: 'relative', width: '300px', height: '300px' }}>
  <h1 className='text-blue mt-4 ml-28'>Face Detection</h1>
  <video ref={videoRef} autoPlay muted style={{ position: 'absolute', top: 0, left: 0, zIndex: 1, height: "300px", width: "300px" }} className='ml-8'></video>
  <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, zIndex: 10, height: "300px", width: "300px" }} className=''></canvas>
</div>
              <div className='mb-80'>
                          {musicInfo.slice(0, 10).map((song, index) => (
                <div
                  className="w-5/6 bg-deep-grey flex items-center gap-8 p-4 m-5 cursor-pointer"
                  key={song.id}
                  onClick={() => play(song.id)}
                >
                  <h1 className="text-sm w-12">#{index + 1}</h1>{" "}
                  {/* Fixed width for index */}
                  <img src={song.image.url} className="h-12" />{" "}
                  {/* Keep image size fixed */}
                  <h1 className="text-sm flex-grow">{song.year}</h1>{" "}
                  {/* Allow year to take remaining space */}
                  <h1 className="text-sm flex-grow">{song.name}</h1>
                
                </div>
              ))}
                    </div>
        </div>
      )}
    </div>
  );
}

export default Moodanalyse;
