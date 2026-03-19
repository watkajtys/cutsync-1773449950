import React, { useEffect } from 'react';
import { AnnotationProvider, useAnnotation } from './AnnotationContext';
import { VideoPlaybackProvider, useVideoPlayback } from './VideoPlaybackContext';

export const ReviewProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AnnotationProvider>
      <VideoPlaybackProvider>
        <ReviewSync />
        {children}
      </VideoPlaybackProvider>
    </AnnotationProvider>
  );
};

const ReviewSync: React.FC = () => {
  const annotation = useAnnotation();
  const video = useVideoPlayback();

  useEffect(() => {
    const handleSeekToNote = (e: Event) => {
      const customEvent = e as CustomEvent;
      const note = customEvent.detail;
      if (note && note.canvas_data) {
        annotation.setShapes(note.canvas_data);
      } else {
        annotation.setShapes([]);
      }
    };
    
    const videoElement = video.videoRef.current;
    if (videoElement) {
      videoElement.addEventListener('seekToNote', handleSeekToNote);
    }
    return () => {
      if (videoElement) {
        videoElement.removeEventListener('seekToNote', handleSeekToNote);
      }
    };
  }, [video.videoRef, annotation.setShapes]);

  return null;
};

export const useReview = () => {
  const annotation = useAnnotation();
  const video = useVideoPlayback();

  return {
    ...annotation,
    ...video
  };
};
