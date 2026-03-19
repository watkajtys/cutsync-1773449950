import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { pb } from '../lib/pocketbase';

export const ProductionPolishView: React.FC = () => {
  const { assetId } = useParams<{ assetId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const tool = searchParams.get('tool') || 'pointer';
  const collapsed = searchParams.get('collapsed') === 'true';

  const setCollapsed = (val) => {
    setSearchParams(prev => {
      prev.set('collapsed', val.toString());
      return prev;
    });
  };

  const setTool = (newTool) => {
    setSearchParams(prev => {
      prev.set('tool', newTool);
      return prev;
    });
  };

  console.log("Asset ID:", assetId);
  console.log("Current Tool:", tool);

  // We add this dummy class toggle to show the transition in design
  const drawerClass = collapsed ? "property-drawer collapsed" : "property-drawer";

  return (
    <div className="bg-background-dark text-slate-100 antialiased overflow-hidden h-screen flex flex-col w-full" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      <header className="flex items-center justify-between whitespace-nowrap border-b border-white/5 px-6 py-3 bg-panel-dark z-50">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center bg-primary rounded-lg shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-white text-xl">sync_alt</span>
            </div>
            <h1 className="text-slate-100 text-lg font-bold leading-tight tracking-tight uppercase">
              CutSync <span className="text-primary text-[10px] font-mono border border-primary/40 rounded px-1.5 py-0.5 ml-1">PRO</span>
            </h1>
          </div>
          <div className="h-6 w-px bg-white/10 hidden md:block"></div>
          <nav className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 text-[9px] font-bold uppercase tracking-widest">Project</span>
              <a className="text-slate-300 hover:text-primary transition-colors text-xs font-medium" href="#">ALPHA_PRODUCTION_R10</a>
            </div>
            <span className="text-slate-700 text-xs">/</span>
            <div className="flex items-center gap-2">
              <span className="text-slate-500 text-[9px] font-bold uppercase tracking-widest">Asset</span>
              <span className="text-slate-100 text-xs font-medium">VFX_SHOT_SC042_V09</span>
            </div>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 rounded-full border border-red-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
            <span className="text-[9px] font-mono tracking-widest text-red-400 font-bold uppercase">Live Session</span>
          </div>
          <button className="flex items-center justify-center rounded-lg h-9 px-4 bg-slate-800 text-slate-100 text-[11px] font-bold uppercase tracking-wider hover:bg-slate-700 transition-all border border-white/5">
            <span className="material-symbols-outlined text-sm mr-2">ios_share</span>
            Export Notes
          </button>
          <div className="w-8 h-8 rounded-full border border-primary/40 overflow-hidden bg-slate-800">
            <img alt="User Avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBo3FUiQvMPUtmO6LyBn_8P6ZuAm7Dm8z-_xnVVDLn19_9zOjPWXdZo8Qdc1mHbSu4zfskNIzoolQQuM21m6J5s1GLom-YndlXh-OL6DU7iJ3SCWSD8nbceaECVL5MN6lwb3VNtvbTIww2B0DoGpubfaIWxtzv92SzhJIWp16KQ6Fp95S6gFUFfGVhYnZMmhyAMn-ob7wmgGJxhCMj_9owNUwDEZcqqvsHKvLukYxkiwuFVLAGm3hxkxkPI0cZZvmUkxS7kEizbpqQC" />
          </div>
        </div>
      </header>
      <main className="flex-1 flex overflow-hidden">
        <aside className={`${drawerClass} w-64 flex flex-col border-r border-white/5 bg-panel-dark`} id="tool-properties-panel">
          <div className="p-5 border-b border-white/5">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500">Tool Properties</h3>
              <button onClick={() => setCollapsed(!collapsed)} className="material-symbols-outlined text-sm text-primary">tune</button>
            </div>
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Color</label>
                  <span className="text-[9px] font-mono text-markup-green">#39FF14</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button className="w-5 h-5 rounded-full bg-markup-green ring-2 ring-white ring-offset-2 ring-offset-panel-dark"></button>
                  <button className="w-5 h-5 rounded-full bg-red-500 hover:scale-110 transition-transform"></button>
                  <button className="w-5 h-5 rounded-full bg-blue-500 hover:scale-110 transition-transform"></button>
                  <button className="w-5 h-5 rounded-full bg-yellow-400 hover:scale-110 transition-transform"></button>
                  <button className="w-5 h-5 rounded-full bg-white hover:scale-110 transition-transform"></button>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Stroke</label>
                  <span className="text-[10px] font-mono text-slate-100">2PX</span>
                </div>
                <div className="px-1">
                  <div className="relative h-1 bg-slate-800 rounded-full flex items-center">
                    <div className="absolute inset-y-0 left-0 w-1/4 bg-primary rounded-full"></div>
                    <div className="absolute left-1/4 w-3 h-3 bg-white rounded-full shadow-xl cursor-pointer"></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Snap to Grid</span>
                <button className="w-7 h-3.5 bg-primary rounded-full relative">
                  <div className="absolute right-0.5 top-0.5 w-2.5 h-2.5 bg-white rounded-full"></div>
                </button>
              </div>
            </div>
          </div>
          <div className="p-5 border-b border-white/5 bg-white/[0.02]">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">history_toggle_off</span>
              Lifecycle &amp; Versioning
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <button className="flex flex-col items-center justify-center gap-1.5 p-3 rounded bg-white/5 border border-white/10 hover:bg-primary/10 hover:border-primary/30 transition-all group">
                <span className="material-symbols-outlined text-lg text-slate-400 group-hover:text-primary">save</span>
                <span className="text-[8px] font-bold uppercase tracking-tighter text-slate-500 group-hover:text-slate-300">Save State</span>
              </button>
              <button className="flex flex-col items-center justify-center gap-1.5 p-3 rounded bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group">
                <span className="material-symbols-outlined text-lg text-slate-400 group-hover:text-slate-200">settings_backup_restore</span>
                <span className="text-[8px] font-bold uppercase tracking-tighter text-slate-500 group-hover:text-slate-300">Revert</span>
              </button>
              <button className="col-span-2 py-2 flex items-center justify-center gap-2 rounded bg-red-500/5 text-red-500/70 border border-red-500/10 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 transition-all font-bold text-[9px] uppercase tracking-[0.15em]">
                <span className="material-symbols-outlined text-sm">delete_sweep</span>
                Clear Canvas
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto telemetry-panel p-5">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-4">Markup History</h3>
            <div className="space-y-2">
              <div className="p-3 bg-white/5 rounded border border-white/5 flex items-center justify-between group cursor-pointer hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-sm text-markup-green">gesture</span>
                  <span className="text-xs text-slate-300 font-medium">Path_01</span>
                </div>
                <span className="material-symbols-outlined text-sm text-slate-500 group-hover:text-slate-200">visibility</span>
              </div>
              <div className="p-3 bg-white/5 rounded border border-white/5 flex items-center justify-between group cursor-pointer hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-sm text-markup-green">rectangle</span>
                  <span className="text-xs text-slate-300 font-medium">Subject_Track</span>
                </div>
                <span className="material-symbols-outlined text-sm text-slate-500 group-hover:text-slate-200">visibility</span>
              </div>
            </div>
          </div>
        </aside>
        <section className="flex-1 relative flex flex-col bg-black overflow-hidden">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-2 p-1.5 bg-panel-dark/80 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl pointer-events-auto">
            <button className="w-12 h-12 flex items-center justify-center rounded-lg bg-primary text-white shadow-lg shadow-primary/20 transition-all">
              <span className="material-symbols-outlined">gesture</span>
            </button>
            <button className="w-12 h-12 flex items-center justify-center rounded-lg bg-transparent text-slate-400 hover:text-white hover:bg-white/5 transition-all">
              <span className="material-symbols-outlined">rectangle</span>
            </button>
            <button className="w-12 h-12 flex items-center justify-center rounded-lg bg-transparent text-slate-400 hover:text-white hover:bg-white/5 transition-all">
              <span className="material-symbols-outlined">text_fields</span>
            </button>
            <button className="w-12 h-12 flex items-center justify-center rounded-lg bg-transparent text-slate-400 hover:text-white hover:bg-white/5 transition-all">
              <span className="material-symbols-outlined">near_me</span>
            </button>
            <div className="w-8 h-px bg-white/10 mx-auto my-1"></div>
            <button className="w-12 h-12 flex items-center justify-center rounded-lg bg-transparent text-slate-400 hover:text-white hover:bg-white/5 transition-all">
              <span className="material-symbols-outlined">undo</span>
            </button>
          </div>
          <div className="flex-1 relative theater-player group cursor-crosshair">
            <div className="absolute inset-0 bg-cover bg-center grayscale-[0.3] brightness-[0.6] pointer-events-none" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD2AZ_NMPDe4Kos-nYVqsRmUb3TXmsfEQ6AZ1Cp-BQZXIF_NySXN66WQDBpvpAxvWHg_bTX3-jdFipaJxvR1YTzd3TnhDB6tUizEZIMM5FVSwzz3Gx-lav-Nn6pd6qY43UE_frcoAm4u_Pu3ILQqeMvlWpnd2fu2IvGUqoXRF_nMgeweVTbrkDhAuJ80hZ_Z5uI_oQOlDaIGc-rxWNfsqEqwRSA2b8l4GHo6PJ1aS9EsXzZ13uJAgVpRjnrtxja1qEGXz45gIaXTSal")' }}></div>
            <div className="absolute inset-0 vfx-grid pointer-events-none opacity-20"></div>
            <div className="absolute inset-0 z-10 pointer-events-none">
              <div className="absolute top-[22%] left-[32%] w-[420px] h-[260px] border-2 border-markup-green shadow-[0_0_20px_rgba(57,255,20,0.3)] pointer-events-none">
                <div className="absolute -top-7 left-0 flex gap-2">
                  <span className="bg-markup-green text-black text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">SUBJECT_TRACK_01</span>
                  <span className="bg-black/90 text-markup-green text-[9px] font-mono px-2 py-0.5 border border-markup-green/40 backdrop-blur-md">X: 1242 Y: 432</span>
                </div>
                <div className="absolute -left-[100vw] right-[-100vw] top-1/2 h-[0.5px] bg-markup-green/30 border-dashed border-b"></div>
                <div className="absolute -top-[1024px] bottom-[-100vh] left-1/2 w-[0.5px] bg-markup-green/30 border-dashed border-r"></div>
              </div>
            </div>
            <div className="absolute left-20 top-8 font-mono text-slate-500 text-[10px] space-y-1 bg-black/40 backdrop-blur p-2 rounded border border-white/5 pointer-events-none">
              <div className="flex items-center gap-2"><span className="w-12 text-slate-400">REC</span> <span className="text-red-500">●</span></div>
              <div className="flex items-center gap-2"><span className="w-12 text-slate-400">GAMMA</span> <span>2.4</span></div>
              <div className="flex items-center gap-2"><span className="w-12 text-slate-400">ISO</span> <span>800</span></div>
            </div>
            <div className="absolute right-8 bottom-8 flex flex-col gap-2 z-30 pointer-events-none">
              <div className="px-3 py-1.5 bg-black/80 border border-white/10 backdrop-blur-md rounded flex items-center gap-4">
                <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Resolution</span>
                <span className="text-[11px] font-mono text-slate-100">4096 × 2160 (DCI)</span>
              </div>
            </div>
          </div>
          <div className="bg-panel-dark border-t border-white/10 p-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1">
                <button className="p-2 text-slate-400 hover:text-white transition-colors"><span className="material-symbols-outlined">skip_previous</span></button>
                <button className="p-2 text-slate-400 hover:text-white transition-colors"><span className="material-symbols-outlined">replay_10</span></button>
                <button className="w-11 h-11 flex items-center justify-center rounded-full bg-primary text-white hover:bg-primary/80 mx-2 transition-all shadow-lg shadow-primary/20">
                  <span className="material-symbols-outlined text-3xl">play_arrow</span>
                </button>
                <button className="p-2 text-slate-400 hover:text-white transition-colors"><span className="material-symbols-outlined">forward_10</span></button>
                <button className="p-2 text-slate-400 hover:text-white transition-colors"><span className="material-symbols-outlined">skip_next</span></button>
              </div>
              <div className="flex-1">
                <div className="relative h-12 flex flex-col justify-center px-4">
                  <div className="relative w-full h-1 bg-slate-800 rounded-full cursor-pointer">
                    <div className="absolute inset-y-0 left-0 w-[42%] bg-primary">
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-[0_0_15px_rgba(13,127,242,1)] border-2 border-primary"></div>
                    </div>
                  </div>
                  <div className="flex justify-between mt-2 font-mono text-[9px] text-slate-500">
                    <span>00:00:00:00</span>
                    <span className="text-primary font-bold">00:14:22:09</span>
                    <span>00:32:15:00</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6 pr-4">
                <div className="text-right">
                  <div className="text-2xl font-mono font-bold text-slate-100 tracking-tighter">00:14:22:09</div>
                  <div className="text-[9px] font-mono text-slate-500 uppercase">FRAME: 20,494</div>
                </div>
                <div className="h-10 w-px bg-white/10"></div>
                <div className="flex items-center gap-1">
                  <button className="p-2 text-slate-400 hover:text-white transition-colors"><span className="material-symbols-outlined">volume_up</span></button>
                  <button className="p-2 text-slate-400 hover:text-white transition-colors"><span className="material-symbols-outlined">fullscreen</span></button>
                </div>
              </div>
            </div>
          </div>
        </section>
        <aside className="w-80 border-l border-white/5 bg-panel-dark flex flex-col">
          <div className="p-5 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500">Annotations</h3>
            <span className="px-2 py-0.5 bg-primary/20 text-primary text-[10px] font-bold rounded-full">12 ACTIVE</span>
          </div>
          <div className="flex-1 overflow-y-auto telemetry-panel p-4 space-y-4">
            <div className="p-4 bg-white/5 rounded-xl border border-white/5 hover:border-primary/30 transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono text-primary font-bold bg-primary/10 px-2 py-0.5 rounded">00:14:22:09</span>
                <span className="text-[10px] text-slate-500">NOW</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed mb-4">Adjust exposure on background elements to match foreground tracking markers. Check the black point levels.</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center border border-white/5">
                    <span className="material-symbols-outlined text-[14px] text-markup-green">gesture</span>
                  </div>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">Markup Layer A</span>
                </div>
                <div className="flex -space-x-1.5">
                  <div className="w-5 h-5 rounded-full border-2 border-panel-dark bg-slate-700"></div>
                  <div className="w-5 h-5 rounded-full border-2 border-panel-dark bg-primary flex items-center justify-center text-[7px] font-bold">+2</div>
                </div>
              </div>
            </div>
            <div className="p-6 border-2 border-dashed border-white/5 rounded-xl flex flex-col items-center justify-center gap-3 hover:bg-white/5 transition-all cursor-pointer group">
              <span className="material-symbols-outlined text-slate-600 group-hover:text-primary transition-colors">add_comment</span>
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest group-hover:text-slate-400">New Annotation</span>
            </div>
          </div>
          <div className="p-5 border-t border-white/5 bg-black/20">
            <div className="flex flex-col gap-3">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500">
                <span>Rendering Cache</span>
                <span className="text-primary">82%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[82%] shadow-[0_0_10px_rgba(13,127,242,0.4)]"></div>
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
};
