import React, { createContext, useContext, useState, useEffect } from 'react';
import PocketBase from 'pocketbase';
import { pb } from '../lib/pocketbase';

export interface PrepContextType {
  assetId: string;
  pb: PocketBase;
  transcripts: any[];
  cutSuggestions: any[];
}

const PrepContext = createContext<PrepContextType | undefined>(undefined);

export const PrepProvider: React.FC<{ assetId: string; children: React.ReactNode }> = ({ assetId, children }) => {
  const [transcripts, setTranscripts] = useState<any[]>([]);
  const [cutSuggestions, setCutSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPrepData = async () => {
        setIsLoading(true);
        try {
            if (assetId) {
                const transcriptRes = await pb.collection('ai_transcripts').getFullList({
                  filter: `asset_id = "${assetId}"`,
                  sort: '+created',
                  requestKey: null
                });
                setTranscripts(transcriptRes || []);

                const cutRes = await pb.collection('ai_cut_suggestions').getFullList({
                  filter: `asset_id = "${assetId}"`,
                  sort: '+start_timecode',
                  requestKey: null
                });
                setCutSuggestions(cutRes || []);
            }
        } catch (error) {
            console.error('Failed to fetch prep data:', error);
            setTranscripts([]);
            setCutSuggestions([]);
        } finally {
            setIsLoading(false);
        }
    };
    fetchPrepData();
  }, [assetId]);

  return (
    <PrepContext.Provider
      value={{
        assetId,
        pb,
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
