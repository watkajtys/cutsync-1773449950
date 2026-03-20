import React from 'react';
import { useParams } from 'react-router-dom';
import { PrepHeader } from '../components/prep/PrepHeader';
import { PrepPlayer } from '../components/prep/PrepPlayer';
import { CutSuggestions } from '../components/prep/CutSuggestions';
import { SourceTranscript } from '../components/prep/SourceTranscript';
import { PrepPlaybackControls } from '../components/prep/PrepPlaybackControls';
import { PrepProvider } from '../contexts/PrepContext';
import { VideoPlaybackProvider } from '../contexts/VideoPlaybackContext';

export const PrepView: React.FC = () => {
  const { assetId } = useParams<{ assetId: string }>();

  if (!assetId) return null;

  return (
    <VideoPlaybackProvider>
      <PrepProvider assetId={assetId}>
        <div className="text-slate-300 h-screen overflow-hidden flex flex-col bg-[#111111] w-full font-sans">
          <PrepHeader />
          <div className="flex-1 flex overflow-hidden relative">
            {/* Sidebar Left */}
            <div className="w-[320px] flex-shrink-0 bg-[#262125] border-r border-white/5 flex flex-col z-20">
              <SourceTranscript />
            </div>

            {/* Main Video Area */}
            <div className="flex-1 relative flex items-center justify-center bg-black/40 overflow-hidden group">
              <PrepPlayer />

              {/* Floating Bottom Right Panel */}
              <div className="absolute bottom-6 right-6 w-[440px] z-30 pointer-events-auto">
                <CutSuggestions />
              </div>
            </div>
          </div>
          
          {/* Bottom Bar Controls */}
          <div className="h-20 bg-[#222125] border-t border-white/5 flex-shrink-0 z-40 relative">
            <PrepPlaybackControls />
          </div>
        </div>
      </PrepProvider>
    </VideoPlaybackProvider>
  );
};
