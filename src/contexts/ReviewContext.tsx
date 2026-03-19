import React from 'react';
import { AnnotationProvider, useAnnotation } from './AnnotationContext';
import { VideoPlaybackProvider, useVideoPlayback } from './VideoPlaybackContext';

export const ReviewProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AnnotationProvider>
      <VideoPlaybackProvider>
        {children}
      </VideoPlaybackProvider>
    </AnnotationProvider>
  );
};

export const useReview = () => {
  const annotation = useAnnotation();
  const video = useVideoPlayback();

  return {
    ...annotation,
    ...video
  };
};
