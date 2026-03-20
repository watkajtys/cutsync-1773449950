import React, { useEffect } from 'react';
import { usePrep } from '../../contexts/PrepContext';
import { useVideoPlayback } from '../../contexts/VideoPlaybackContext';

export const PrepPlayer: React.FC = () => {
  const { assetId } = usePrep();
  const { videoRef, setCurrentTime, setDuration, currentTime, assetUrl, loadAsset } = useVideoPlayback();

  useEffect(() => {
    if (assetId) {
      loadAsset(assetId);
    }
  }, [assetId, loadAsset]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
        if (Math.abs(currentTime - videoRef.current.currentTime) > 0.5) {
            setCurrentTime(videoRef.current.currentTime, false);
        }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  if (!assetId) {
    return (
      <div className="w-full h-full relative flex items-center justify-center p-8 bg-black/60 shadow-inner">
        <div className="text-white/40 text-sm">Loading asset...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative flex items-center justify-center p-8 bg-black/60 shadow-inner">
      <div className="w-full max-w-[1280px] aspect-video relative rounded-lg overflow-hidden bg-black/80 ring-1 ring-white/10 shadow-[0_0_60px_rgba(0,0,0,0.8)] flex items-center justify-center">
        {!assetUrl && <div className="absolute inset-0 flex items-center justify-center text-white/40 text-sm z-0">Loading video stream...</div>}
        <video
          ref={videoRef}
          src={assetUrl || "/dummy.mp4"}
          className="w-full h-full object-cover z-10"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          controls={false}
        />
      </div>
    </div>
  );
};
