import React, { useRef, useEffect, useState } from 'react';
import { useContext } from 'react';
import { Context } from './context.js';
import useMediaQuery from './useMedia';
import * as faceapi from 'face-api.js';
import { songBymood } from './saavnapi';
import he from 'he';

function Moodanalyse() {
  const { songid, setSongid } = useContext(Context);
  const isAboveMedium = useMediaQuery("(min-width: 768px)");
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [dominantExpression, setDominantExpression] = useState(null);
  const [musicInfo, setMusicInfo] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVideoActive, setIsVideoActive] = useState(true);
  const [lastExpression, setLastExpression] = useState(null);
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          await loadModels();
          if (mounted && isVideoActive) {
            await startVideo();
            faceMyDetect();
          }
        } catch (err) {
          console.error("Error initializing:", err);
          if (mounted) {
            setIsVideoActive(false);
          }
        }
      } else {
        console.error("getUserMedia is not supported in this browser.");
      }
    };

    init();
    
    // Cleanup function to stop all media tracks and handle unmounting
    return () => {
      mounted = false;
      stopVideo();
      setIsVideoActive(false);
    };
  }, []);

  const startVideo = async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user"
        } 
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
        await videoRef.current.play();
      }
    } catch (err) {
      console.error("Error accessing media devices:", err);
    }
  };
  const stopVideo = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
        track.enabled = false;
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current.load(); // Force video element to reset
    }
    // Clear the canvas
    if (canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    setDominantExpression(null); // Reset mood when camera is off
  };

  const toggleVideo = async () => {
    try {
      if (isVideoActive) {
        stopVideo();
        setIsVideoActive(false);
      } else {
        await startVideo();
        setIsVideoActive(true);
        faceMyDetect();
      }
    } catch (err) {
      console.error("Error toggling video:", err);
      stopVideo(); // Ensure cleanup if there's an error
      setIsVideoActive(false);
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
      setIsLoading(false);
      startVideo();
      faceMyDetect();
    } catch (err) {
      console.error("Error loading models:", err);
    }
  };
  const faceMyDetect = async () => {
    try {
      let detectionInterval = setInterval(async () => {
        if (!videoRef.current || !canvasRef.current || !isVideoActive || !streamRef.current) {
          clearInterval(detectionInterval);
          return;
        }
        // Check if video stream is actually active
        if (!streamRef.current.active) {
          clearInterval(detectionInterval);
          stopVideo();
          setIsVideoActive(false);
          return;
        }

        const detections = await faceapi.detectAllFaces(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions({
            inputSize: 224,
            scoreThreshold: 0.5
          })
        ).withFaceLandmarks().withFaceExpressions();

        if (detections.length > 0) {
          const displaySize = {
            width: videoRef.current.videoWidth,
            height: videoRef.current.videoHeight
          };

          canvasRef.current.width = displaySize.width;
          canvasRef.current.height = displaySize.height;

          const context = canvasRef.current.getContext('2d');
          context.clearRect(0, 0, displaySize.width, displaySize.height);

          const resizedDetections = faceapi.resizeResults(detections, displaySize);

          faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
          faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
          faceapi.draw.drawFaceExpressions(canvasRef.current, resizedDetections);

          const firstDetection = resizedDetections[0];
          if (firstDetection) {
            const expressions = firstDetection.expressions;
            const dominant = Object.keys(expressions).reduce((a, b) => 
              expressions[a] > expressions[b] ? a : b
            );

            // Only update if expression has changed or confidence is high
            if (dominant !== lastExpression && expressions[dominant] > 0.7) {
              setDominantExpression(dominant);
              setLastExpression(dominant);
            }
          }
        }
      }, 200); // Reduced frequency for better performance

      return () => clearInterval(detectionInterval);
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
              image: song.image[2] ? song.image[2] : song.image[1],
              artist: song.artists.primary[0].name,
              year: song.year,
            }))
          );
        } catch (err) {
          console.error("Error fetching song:", err);
        }
      };

      fetchSong();
      intervalId = setInterval(fetchSong, 300);
    }
    return () => clearInterval(intervalId);
  }, [dominantExpression]);

  const play = async (id) => {
    localStorage.setItem("songid", id);
    setSongid(id);
  };

  return (
    <div className="h-screen w-full overflow-y-auto pb-20 pt-4 bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-emerald-500/20 mix-blend-plus-lighter blur-3xl animate-blob"></div>
        <div className="absolute top-1/2 -right-20 w-72 h-72 rounded-full bg-green-400/20 mix-blend-plus-lighter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-20 left-1/2 w-72 h-72 rounded-full bg-teal-500/20 mix-blend-plus-lighter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Content Container */}
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-green-300 to-teal-400 mb-4">
              Let Your Mood Sing For You
            </h1>
            <p className="text-emerald-100/80 text-lg">
              Experience music that matches your emotions in real-time
            </p>
          </div>

          {isAboveMedium ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Face Detection Section */}
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-900/50 to-green-800/50 backdrop-blur-sm border border-emerald-500/20 shadow-xl">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold text-emerald-300">Face Detection</h2>
                    <button
                      onClick={toggleVideo}
                      className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                        isVideoActive
                          ? 'bg-red-500/20 hover:bg-red-500/30 text-red-300'
                          : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300'
                      } border border-current`}
                    >
                      <div className="flex items-center gap-2">
                        {isVideoActive ? (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                            </svg>
                            <span>Stop Camera</span>
                          </>
                        ) : (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            <span>Start Camera</span>
                          </>
                        )}
                      </div>
                    </button>
                  </div>

                  <div className="relative aspect-video rounded-lg overflow-hidden bg-black/50">
                    {isVideoActive ? (
                      <>
                        <video
                          ref={videoRef}
                          className="absolute inset-0 w-full h-full object-cover"
                        ></video>
                        <canvas
                          ref={canvasRef}
                          className="absolute inset-0 w-full h-full"
                        ></canvas>
                      </>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-emerald-300/70">Camera is turned off</p>
                      </div>
                    )}
                    {isLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
                      </div>
                    )}
                  </div>

                  {dominantExpression && isVideoActive && (
                    <div className="mt-4 p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                      <p className="text-emerald-300 text-sm">
                        Current Mood: <span className="font-semibold text-white capitalize">{dominantExpression}</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Music Recommendations Section */}
              <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-900/50 to-green-800/50 backdrop-blur-sm border border-emerald-500/20 shadow-xl">
                <div className="p-6">
                  <h2 className="text-2xl font-semibold text-emerald-300 mb-4">Recommended Tracks</h2>
                  <div className="space-y-3">
                    {musicInfo.slice(0, 8).map((song, index) => (
                      <div
                        key={song.id}
                        onClick={() => play(song.id)}
                        className="group flex items-center gap-4 p-3 rounded-lg bg-black/20 hover:bg-emerald-500/10 transition-all duration-300 cursor-pointer border border-transparent hover:border-emerald-500/20"
                      >
                        <span className="w-6 text-sm text-emerald-500/70">#{index + 1}</span>
                        <img 
                          src={song.image.url} 
                          alt={song.name}
                          className="h-12 w-12 rounded object-cover group-hover:shadow-lg group-hover:shadow-emerald-500/20 transition-all duration-300" 
                        />
                        <div className="flex-grow min-w-0">
                          <h3 className="font-medium text-white truncate group-hover:text-emerald-400 transition-colors duration-300">
                            {song.name}
                          </h3>
                          <p className="text-sm text-emerald-300/70 truncate">{song.artist}</p>
                        </div>
                        <span className="text-sm text-emerald-500/50">{song.year}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Mobile Layout */
            <div className="space-y-6">
              {/* Face Detection */}
              <div className="rounded-xl overflow-hidden bg-gradient-to-br from-emerald-900/50 to-green-800/50 backdrop-blur-sm border border-emerald-500/20">
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-emerald-300 mb-3">Face Detection</h2>
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-black/50">
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      className="absolute inset-0 w-full h-full object-cover"
                    ></video>
                    <canvas
                      ref={canvasRef}
                      className="absolute inset-0 w-full h-full"
                    ></canvas>
                    {isLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500"></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Music Recommendations */}
              <div className="rounded-xl overflow-hidden bg-gradient-to-br from-emerald-900/50 to-green-800/50 backdrop-blur-sm border border-emerald-500/20">
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-emerald-300 mb-3">Recommended Tracks</h2>
                  <div className="space-y-2">
                    {musicInfo.slice(0, 6).map((song, index) => (
                      <div
                        key={song.id}
                        onClick={() => play(song.id)}
                        className="group flex items-center gap-3 p-2 rounded-lg bg-black/20 hover:bg-emerald-500/10 transition-all duration-300 cursor-pointer border border-transparent hover:border-emerald-500/20"
                      >
                        <span className="w-5 text-xs text-emerald-500/70">#{index + 1}</span>
                        <img 
                          src={song.image.url} 
                          alt={song.name}
                          className="h-10 w-10 rounded object-cover" 
                        />
                        <div className="flex-grow min-w-0">
                          <h3 className="font-medium text-sm text-white truncate group-hover:text-emerald-400 transition-colors duration-300">
                            {song.name}
                          </h3>
                          <p className="text-xs text-emerald-300/70 truncate">{song.artist}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Moodanalyse;
