import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Database, Play, SkipBack, SkipForward, 
  Settings, Maximize, Send, CheckCircle, PenTool, Activity
} from 'lucide-react';
import { ChronologicalRiverTop } from '../components/theater/ChronologicalRiverTop';

export const TheaterView: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const isDrawerOpen = searchParams.get('drawer') === 'collaboration';

  const toggleDrawer = () => {
    if (isDrawerOpen) {
      searchParams.delete('drawer');
    } else {
      searchParams.set('drawer', 'collaboration');
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="text-slate-300 h-screen overflow-hidden flex flex-col bg-[#050608] w-full">
      <header className="h-14 flex items-center justify-between px-6 border-b border-white/5 bg-black/40 backdrop-blur-2xl z-50">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2.5">
            <Link to="/" className="bg-primary p-1 rounded-md flex items-center justify-center hover:opacity-80 transition-opacity">
              <Database className="text-white w-[18px] h-[18px]" strokeWidth={2} />
            </Link>
            <h2 className="text-white text-lg font-black tracking-tight">CutSync</h2>
          </div>
          <nav className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.2em]">
            <span className="flex items-center gap-2 px-3 py-1.5 rounded-md text-slate-400">
              THEATER MODE
            </span>
            <span className="text-slate-800 mx-1">•</span>
            <span className="text-primary">CINEMATIC WIDE</span>
          </nav>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-lg px-4 py-1.5">
            <div className="flex flex-col items-center">
              <span className="text-[9px] text-slate-500 font-bold leading-none mb-1">CURRENT TIMECODE</span>
              <span className="text-sm font-mono text-white font-medium tracking-widest">00:14:02:11</span>
            </div>
          </div>
          <div className="h-8 w-8 rounded-full border border-white/10 overflow-hidden">
            <img alt="User" className="w-full h-full object-cover grayscale opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKrR0gaqFvnHYP_Yysmi98tV5mR20XmbS1FPtbP9ShGhx_ybqp2HLKkM8XkPy7oHPd7Qm5DIfdw7akfyiXxhKvXBLulA7ZXN4j3O2qv_52kC5RK6hkcL61b5w6_Qmz8fKTA-uy-S3Y6VeXWXiUZus3orcutLGDrPKKNLJ5EVDzCQBKR3gVImTAVaSzLl79zfLsYU9kUHxuqt3lwVzjE5tb7wbvogw9lzDaHFO1XNT7tXOyUlDxw3alQlUlniwizYEZrOr-tu4o05E"/>
          </div>
        </div>
      </header>

      <ChronologicalRiverTop />

      <main className="flex-1 flex flex-col items-center justify-center p-8 bg-black relative overflow-hidden">
        <div className="video-container w-full max-w-7xl relative bg-black shadow-[0_0_100px_rgba(0,0,0,1)] ring-1 ring-white/5">
          <img alt="Cinematic Content" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6C5kYDZtuJGpypOT0LOGUpiCxJ04IluVt0NtnMAYUS0KaSK5rKBHTwWoYhRpLCNOguVUdp4x8aElSCab-FeEK7zcRCeuHU09MwP0oiIT5O_vpnu-iQwo0k07ImqxZdPfYPfMFQKnaQwX-Wl0tvjk7lo0Pi7_cRyvPMARNGos_9HZqCOHcf0btx6Orh5Dhmwglxkvzm0IXdotBjZVGV4PDMpTrBRk3k76aJZybsz3wmBGGcOzodO_09Q9sDm26sZlRvo3MJm24asg"/>
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
          <div className="absolute top-6 left-6 flex items-center gap-4">
            <div className="flex flex-col">
              <span className="text-[10px] text-white/40 font-bold tracking-widest uppercase">Project</span>
              <span className="text-xs text-white/80 font-medium">SILENT HORIZON_V03.mxf</span>
            </div>
          </div>
          <div className="absolute bottom-6 right-6 text-right">
            <span className="text-[10px] text-white/40 font-bold tracking-widest uppercase">Ratio</span>
            <p className="text-xs text-white/80 font-medium tracking-tight">2.39:1 Cinemascope</p>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center gap-6">
          <div className="flex items-center gap-12">
            <button className="text-slate-500 hover:text-white transition-colors">
              <SkipBack className="w-6 h-6" strokeWidth={1.5} />
            </button>
            <button className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform">
              <Play className="w-8 h-8 fill-black" strokeWidth={1} />
            </button>
            <button className="text-slate-500 hover:text-white transition-colors">
              <SkipForward className="w-6 h-6" strokeWidth={1.5} />
            </button>
          </div>
          <div className="flex items-center gap-8 text-[10px] font-bold tracking-[0.2em] text-slate-600">
            <button className="hover:text-primary transition-colors uppercase">Metadata</button>
            <button className="hover:text-primary transition-colors uppercase">Versions</button>
            <button className="hover:text-primary transition-colors uppercase">Export</button>
          </div>
        </div>

        <div className={`absolute bottom-0 left-0 right-0 bg-surface/90 backdrop-blur-3xl border-t border-white/10 transform transition-transform duration-500 ease-in-out z-40 ${isDrawerOpen ? 'translate-y-0' : 'translate-y-[calc(100%-48px)]'}`}>
          <div 
            onClick={toggleDrawer}
            className="h-12 flex items-center justify-center cursor-pointer border-b border-white/5 relative"
          >
            <div className="w-12 h-1 bg-white/20 rounded-full absolute top-2"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Collaboration & Review Drawer</span>
          </div>
          <div className="h-64 flex divide-x divide-white/5">
            <div className="flex-1 p-6 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Active Comments (12)</h4>
                <button className="text-primary text-[10px] font-bold uppercase">View All</button>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-2">
                <div className="flex gap-4 p-3 rounded-lg bg-white/5 border border-white/5">
                  <div className="h-8 w-8 rounded-full overflow-hidden bg-slate-800 flex-shrink-0">
                    <img alt="User" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzKhWLSKnAzAauvIwjImoVPnPTt7-K2rcU455fWERDrWZcF8nPI2Q1G38CznoSOoZuwvZ6I01Vb789wHd_c9J01e6L5whT2ItHyaUQaMfx-izq9DyBNaPO5FPxnuh2UxkNcbRMVhQNRdKzrctpCwYbMvGqlOPrugw6B3N9Ot-OyWU131KF-43uxXfwexisEdIJhSoaUz9_ZY9Tw-5_EEBjWATiYcJlclLkKh40HR07xEi22LuZ4wJfpALdgSAPFdU2e0sOIHeZgbM"/>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-slate-200">Sarah J.</span>
                      <span className="text-[10px] font-mono text-primary font-bold">00:12:05</span>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed">The atmospheric mist layer is slightly overpowering the highlights in the left quadrant.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-1/3 p-6 flex flex-col bg-black/20">
              <div className="mb-4">
                <h4 className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Quick Actions</h4>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors group">
                  <PenTool className="text-slate-400 group-hover:text-primary w-6 h-6" strokeWidth={1.5} />
                  <span className="text-[9px] font-bold uppercase tracking-widest">Annotate</span>
                </button>
                <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors group">
                  <CheckCircle className="text-slate-400 group-hover:text-emerald-500 w-6 h-6" strokeWidth={1.5} />
                  <span className="text-[9px] font-bold uppercase tracking-widest">Approve</span>
                </button>
              </div>
              <div className="relative mt-auto">
                <textarea className="w-full bg-surface border border-white/10 rounded-lg p-3 text-sm focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-slate-600 resize-none" placeholder="Drop a note..." rows={2}></textarea>
                <button className="absolute bottom-2 right-2 bg-primary text-white p-1.5 rounded-md">
                  <Send className="w-3.5 h-3.5" strokeWidth={2} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="h-8 bg-black border-t border-white/5 px-6 flex items-center justify-between text-[9px] font-bold text-slate-600 uppercase tracking-widest z-50">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
            ACTIVE SESSION: ALEX_RIVERS
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-3 h-3" />
            SYNCED: 42.1 MS LATENCY
          </div>
        </div>
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4">
            <Settings className="w-4 h-4 hover:text-white cursor-pointer transition-colors" />
            <Maximize className="w-4 h-4 hover:text-white cursor-pointer transition-colors" />
          </div>
          <div className="text-slate-800">BUILD 0.92-ALPHA</div>
        </div>
      </footer>
    </div>
  );
};
