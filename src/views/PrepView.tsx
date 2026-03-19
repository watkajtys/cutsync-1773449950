import React from 'react';
import { useParams } from 'react-router-dom';
import { PrepHeader } from '../components/prep/PrepHeader';
import { PrepPlayer } from '../components/prep/PrepPlayer';
import { CutSuggestions } from '../components/prep/CutSuggestions';
import { SourceTranscript } from '../components/prep/SourceTranscript';
import { PrepFooter } from '../components/prep/PrepFooter';
import { PrepProvider } from '../contexts/PrepContext';
import { VideoPlaybackProvider } from '../contexts/VideoPlaybackContext';

export const PrepView: React.FC = () => {
  const { assetId } = useParams<{ assetId: string }>();

  if (!assetId) return null;

  return (
    <VideoPlaybackProvider>
      <PrepProvider assetId={assetId}>
        <div className="text-slate-300 h-screen overflow-hidden flex flex-col bg-[#050608] w-full">
          <PrepHeader />
          <div className="flex-1 flex flex-col overflow-hidden">
            <PrepPlayer />
            <section className="flex-1 flex overflow-hidden">
              <CutSuggestions />
              <SourceTranscript />
            </section>
          </div>
          <PrepFooter />
        </div>
      </PrepProvider>
    </VideoPlaybackProvider>
  );
};
