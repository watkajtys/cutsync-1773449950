import { useEffect } from 'react';

export const useKeyboardShortcuts = (
  videoRef: React.RefObject<HTMLVideoElement>,
  isPlaying: boolean,
  setIsPlaying: (isPlaying: boolean) => void,
  clearDrawing: () => void,
  inputRef: React.RefObject<HTMLTextAreaElement>
) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        if (videoRef.current) {
          if (isPlaying) {
            videoRef.current.pause();
            setIsPlaying(false);
          } else {
            videoRef.current.play();
            setIsPlaying(true);
            clearDrawing();
          }
        }
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [videoRef, inputRef, isPlaying, clearDrawing, setIsPlaying]);
};
