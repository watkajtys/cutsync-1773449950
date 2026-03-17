import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import PocketBase from 'pocketbase';

export interface PrepContextType {
  assetId: string;
  pb: PocketBase;
  currentTime: number;
  duration: number;
  setCurrentTime: (time: number, programmatic?: boolean) => void;
  setDuration: (time: number) => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  transcripts: any[];
  cutSuggestions: any[];
}

const pbUrl = import.meta.env.VITE_POCKETBASE_URL || 'http://127.0.0.1:8090';
const pb = new PocketBase(pbUrl);

const PrepContext = createContext<PrepContextType | undefined>(undefined);

export const PrepProvider: React.FC<{ assetId: string; children: React.ReactNode }> = ({ assetId, children }) => {
  const [currentTime, setCurrentTimeState] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [transcripts, setTranscripts] = useState<any[]>([]);
  const [cutSuggestions, setCutSuggestions] = useState<any[]>([]);

  const setCurrentTime = (time: number, programmatic: boolean = true) => {
    setCurrentTimeState(time);
    if (programmatic && videoRef.current) {
        if (Math.abs(videoRef.current.currentTime - time) > 0.1) {
            videoRef.current.currentTime = time;
            // Dispatch native timeupdate event to trigger any internal listeners
            videoRef.current.dispatchEvent(new Event('timeupdate'));
        }
    }
  };

  useEffect(() => {
    const fetchPrepData = async () => {
        try {
            const transcriptRes = await pb.collection('ai_transcripts').getFullList({
                filter: `asset_id = "${assetId}"`,
                sort: '+created',
                requestKey: null
            });
            setTranscripts(transcriptRes);

            const cutRes = await pb.collection('ai_cut_suggestions').getFullList({
                filter: `asset_id = "${assetId}"`,
                sort: '+start_timecode',
                requestKey: null
            });
            setCutSuggestions(cutRes);
        } catch (error) {
            console.error('Failed to fetch prep data:', error);
        }
    };
    fetchPrepData();
  }, [assetId]);

  return (
    <PrepContext.Provider
      value={{
        assetId,
        pb,
        currentTime,
        duration,
        setCurrentTime,
        setDuration,
        videoRef,
        transcripts,
        cutSuggestions
      }}
    >
      {children}
    </PrepContext.Provider>
  );
};

export const usePrep = () => {
  const context = useContext(PrepContext);
  if (!context) {
    throw new Error('usePrep must be used within a PrepProvider');
  }
  return context;
};
