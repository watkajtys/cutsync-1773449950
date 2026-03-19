import React, { createContext, useContext, useState, useEffect } from 'react';
import PocketBase from 'pocketbase';
import { pb } from '../lib/pocketbase';
import { fetchTranscripts, fetchCutSuggestions } from '../api/prep';

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

  useEffect(() => {
    const fetchPrepData = async () => {
        try {
            
            const transcriptRes = await fetchTranscripts(assetId);
            setTranscripts(transcriptRes);

            const cutRes = await fetchCutSuggestions(assetId);
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
