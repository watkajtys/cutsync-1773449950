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

  return (
    <div className="w-full h-full relative flex items-center justify-center p-8 bg-black/60 shadow-inner">
      <div className="w-full max-w-[1280px] aspect-video relative rounded-lg overflow-hidden bg-black/80 ring-1 ring-white/10 shadow-[0_0_60px_rgba(0,0,0,0.8)]">
        <video
          ref={videoRef}
          src={assetUrl || "/dummy.mp4"}
          className="w-full h-full object-cover"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          controls={false}
        />
      </div>
    </div>
  );
};
