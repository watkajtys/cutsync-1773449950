import React from 'react';
import { useParams, Link } from 'react-router-dom';

export const ReviewView: React.FC = () => {
  const { assetId } = useParams();

  return (
    <div className="text-slate-300 h-screen overflow-hidden flex flex-col bg-[#0c0e14] w-full">
      <header className="h-14 flex items-center justify-between px-6 border-b border-border-subtle bg-surface/80 backdrop-blur-xl z-50">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2.5">
            <div className="bg-primary p-1 rounded-md flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-lg">database</span>
            </div>
            <h2 className="text-white text-lg font-black tracking-tight">CutSync</h2>
          </div>
          <nav className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest">
            <Link to="/" className="flex items-center gap-2 px-3 py-1.5 rounded-md text-primary bg-primary/10 transition-colors">
              <span className="material-symbols-outlined text-sm">play_circle</span>
              Active Workspace
            </Link>
            <span className="text-slate-600 mx-1">/</span>
            <span className="flex items-center gap-2 px-3 py-1.5 rounded-md text-slate-500 hover:text-slate-300 transition-colors cursor-default">
              <span className="material-symbols-outlined text-sm">visibility</span>
              Review Pipeline
            </span>
          </nav>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 bg-black/30 border border-border-subtle rounded-lg px-3 py-1.5">
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-slate-500 font-bold leading-none">TIMECODE</span>
              <span className="text-sm font-mono text-emerald-400 font-bold">00:14:02:11</span>
            </div>
            <div className="w-[1px] h-6 bg-border-subtle"></div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-slate-500 font-bold leading-none">FRAME</span>
              <span className="text-sm font-mono text-white font-bold">20,187</span>
            </div>
          </div>
          <div className="flex items-center gap-3 border-l border-border-subtle pl-6">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-slate-200">Alex Rivers</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">Reviewer</p>
            </div>
            <div className="h-8 w-8 rounded-full border border-primary/40 overflow-hidden">
              <img alt="User" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKrR0gaqFvnHYP_Yysmi98tV5mR20XmbS1FPtbP9ShGhx_ybqp2HLKkM8XkPy7oHPd7Qm5DIfdw7akfyiXxhKvXBLulA7ZXN4j3O2qv_52kC5RK6hkcL61b5w6_Qmz8fKTA-uy-S3Y6VeXWXiUZus3orcutLGDrPKKNLJ5EVDzCQBKR3gVImTAVaSzLl79zfLsYU9kUHxuqt3lwVzjE5tb7wbvogw9lzDaHFO1XNT7tXOyUlDxw3alQlUlniwizYEZrOr-tu4o05E"/>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 flex overflow-hidden">
        <section className="flex-1 bg-black flex flex-col relative group">
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="video-container w-full max-w-6xl relative bg-slate-900 rounded-lg overflow-hidden shadow-2xl border border-white/5" style={{ aspectRatio: '21 / 9' }}>
              <img alt="Silent Horizon Review" className="w-full h-full object-cover opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6C5kYDZtuJGpypOT0LOGUpiCxJ04IluVt0NtnMAYUS0KaSK5rKBHTwWoYhRpLCNOguVUdp4x8aElSCab-FeEK7zcRCeuHU09MwP0oiIT5O_vpnu-iQwo0k07ImqxZdPfYPfMFQKnaQwX-Wl0tvjk7lo0Pi7_cRyvPMARNGos_9HZqCOHcf0btx6Orh5Dhmwglxkvzm0IXdotBjZVGV4PDMpTrBRk3k76aJZybsz3wmBGGcOzodO_09Q9sDm26sZlRvo3MJm24asg"/>
              <div className="absolute top-4 left-4 pointer-events-none">
                <div className="flex items-center gap-3">
                  <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded-sm font-bold animate-pulse">REC</span>
                  <span className="text-[11px] font-mono text-white/60 tracking-tighter">SCENE 04 | TAKE 02 | V03</span>
                </div>
              </div>
              <div className="absolute top-4 right-4 text-right pointer-events-none">
                <p className="text-[10px] font-bold text-white/40 tracking-widest uppercase">Resolution</p>
                <p className="text-xs font-bold text-white/80">4K DCI (4096 x 1716)</p>
              </div>
              <div className="absolute inset-0 flex items-center justify-center group-hover:opacity-0 transition-opacity">
                <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-5xl fill-1">play_arrow</span>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/10">
                <div className="h-full bg-primary w-[34%] relative">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full border-2 border-white shadow-lg"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="h-16 bg-surface-accent border-t border-border-subtle flex items-center justify-between px-8">
            <div className="flex items-center gap-6">
              <button className="text-slate-400 hover:text-white transition-colors">
                <span className="material-symbols-outlined">first_page</span>
              </button>
              <button className="text-slate-400 hover:text-white transition-colors">
                <span className="material-symbols-outlined">fast_rewind</span>
              </button>
              <button className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform">
                <span className="material-symbols-outlined fill-1">play_arrow</span>
              </button>
              <button className="text-slate-400 hover:text-white transition-colors">
                <span className="material-symbols-outlined">fast_forward</span>
              </button>
              <button className="text-slate-400 hover:text-white transition-colors">
                <span className="material-symbols-outlined">last_page</span>
              </button>
            </div>
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-500 text-lg">volume_up</span>
                <div className="w-24 h-1 bg-slate-700 rounded-full overflow-hidden">
                  <div className="bg-primary w-2/3 h-full"></div>
                </div>
              </div>
              <div className="h-6 w-[1px] bg-border-subtle"></div>
              <div className="flex items-center gap-4">
                <button className="p-1.5 rounded-md hover:bg-white/5 text-slate-400 hover:text-white">
                  <span className="material-symbols-outlined">closed_caption</span>
                </button>
                <button className="p-1.5 rounded-md hover:bg-white/5 text-slate-400 hover:text-white">
                  <span className="material-symbols-outlined">settings</span>
                </button>
                <button className="p-1.5 rounded-md hover:bg-white/5 text-slate-400 hover:text-white">
                  <span className="material-symbols-outlined">fullscreen</span>
                </button>
              </div>
            </div>
          </div>
        </section>
        <aside className="w-[400px] border-l border-border-subtle bg-surface flex flex-col">
          <div className="flex border-b border-border-subtle">
            <button className="flex-1 py-4 text-[10px] font-bold uppercase tracking-widest text-primary border-b-2 border-primary">
              Comments
            </button>
            <button className="flex-1 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-300 transition-colors">
              History
            </button>
            <button className="flex-1 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-300 transition-colors">
              Metadata
            </button>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full overflow-hidden border border-border-subtle flex-shrink-0">
                  <img alt="User" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzKhWLSKnAzAauvIwjImoVPnPTt7-K2rcU455fWERDrWZcF8nPI2Q1G38CznoSOoZuwvZ6I01Vb789wHd_c9J01e6L5whT2ItHyaUQaMfx-izq9DyBNaPO5FPxnuh2UxkNcbRMVhQNRdKzrctpCwYbMvGqlOPrugw6B3N9Ot-OyWU131KF-43uxXfwexisEdIJhSoaUz9_ZY9Tw-5_EEBjWATiYcJlclLkKh40HR07xEi22LuZ4wJfpALdgSAPFdU2e0sOIHeZgbM"/>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-200">Sarah Jenkins</span>
                    <span className="text-[10px] font-mono text-primary font-bold px-1.5 py-0.5 bg-primary/10 rounded">00:12:05</span>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed mb-2">The mist in the background feels a bit too heavy. Can we dial down the atmospheric layer by 15%?</p>
                  <div className="flex items-center gap-4">
                    <button className="text-[10px] font-bold text-slate-500 hover:text-primary uppercase tracking-wider">Reply</button>
                    <button className="text-[10px] font-bold text-slate-500 hover:text-emerald-400 uppercase tracking-wider">Resolve</button>
                  </div>
                </div>
              </div>
              <div className="pl-11">
                <div className="flex gap-3">
                  <div className="h-6 w-6 rounded-full overflow-hidden border border-border-subtle flex-shrink-0">
                    <img alt="User" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKrR0gaqFvnHYP_Yysmi98tV5mR20XmbS1FPtbP9ShGhx_ybqp2HLKkM8XkPy7oHPd7Qm5DIfdw7akfyiXxhKvXBLulA7ZXN4j3O2qv_52kC5RK6hkcL61b5w6_Qmz8fKTA-uy-S3Y6VeXWXiUZus3orcutLGDrPKKNLJ5EVDzCQBKR3gVImTAVaSzLl79zfLsYU9kUHxuqt3lwVzjE5tb7wbvogw9lzDaHFO1XNT7tXOyUlDxw3alQlUlniwizYEZrOr-tu4o05E"/>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-bold text-slate-300">Alex Rivers</span>
                      <span className="text-[9px] text-slate-500 uppercase">2h ago</span>
                    </div>
                    <p className="text-xs text-slate-500">Agreed. I'll adjust the depth matte in the composite.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-[1px] bg-border-subtle"></div>
            <div className="flex gap-3">
              <div className="h-8 w-8 rounded-full bg-amber-500 flex items-center justify-center text-white flex-shrink-0">
                <span className="material-symbols-outlined text-sm">visibility</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-200">Velocity Client</span>
                  <span className="text-[10px] font-mono text-primary font-bold px-1.5 py-0.5 bg-primary/10 rounded">00:13:44</span>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">Let's hold on this frame for 12 more frames to catch the peak of the flare.</p>
              </div>
            </div>
          </div>
          <div className="p-4 border-t border-border-subtle bg-surface-accent">
            <div className="relative">
              <textarea className="w-full bg-surface border border-border-subtle rounded-lg p-3 text-sm focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-slate-600 resize-none" placeholder="Add a comment at 00:14:02:11..." rows={3}></textarea>
              <div className="absolute bottom-3 right-3 flex items-center gap-2">
                <button className="text-slate-500 hover:text-slate-300">
                  <span className="material-symbols-outlined">attach_file</span>
                </button>
                <button className="bg-primary hover:bg-primary/90 text-white p-1.5 rounded-md transition-all">
                  <span className="material-symbols-outlined fill-1">send</span>
                </button>
              </div>
            </div>
          </div>
        </aside>
      </main>
      <section className="h-32 border-t border-border-subtle bg-surface relative">
        <div className="h-6 flex items-center px-4 bg-black/40 border-b border-border-subtle justify-between">
          <h3 className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Chronological River • Frame-by-Frame Navigation</h3>
          <div className="flex items-center gap-3">
            <span className="text-[9px] font-bold text-slate-600 uppercase">Zoom: 1:1</span>
            <div className="w-20 h-1 bg-slate-800 rounded-full overflow-hidden">
              <div className="bg-slate-600 w-1/2 h-full"></div>
            </div>
          </div>
        </div>
        <div className="flex-1 h-[calc(100%-24px)] flex overflow-x-auto custom-scrollbar relative">
          <div className="flex items-center h-full px-4 gap-1.5 min-w-max relative">
            <div className="absolute left-[34%] top-0 bottom-0 w-0.5 bg-primary z-20 shadow-[0_0_15px_rgba(43,108,238,0.8)]">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-primary rotate-45 -translate-y-1.5"></div>
            </div>
            <div className="flex items-center gap-1">
              <div className="relative group cursor-pointer opacity-40 hover:opacity-100 transition-opacity">
                <img alt="Frame" className="w-32 h-18 object-cover rounded-sm border border-white/5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6C5kYDZtuJGpypOT0LOGUpiCxJ04IluVt0NtnMAYUS0KaSK5rKBHTwWoYhRpLCNOguVUdp4x8aElSCab-FeEK7zcRCeuHU09MwP0oiIT5O_vpnu-iQwo0k07ImqxZdPfYPfMFQKnaQwX-Wl0tvjk7lo0Pi7_cRyvPMARNGos_9HZqCOHcf0btx6Orh5Dhmwglxkvzm0IXdotBjZVGV4PDMpTrBRk3k76aJZybsz3wmBGGcOzodO_09Q9sDm26sZlRvo3MJm24asg"/>
                <span className="absolute bottom-1 right-1 text-[8px] font-mono text-white/50">20100</span>
              </div>
              <div className="relative group cursor-pointer opacity-40 hover:opacity-100 transition-opacity">
                <img alt="Frame" className="w-32 h-18 object-cover rounded-sm border border-white/5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6C5kYDZtuJGpypOT0LOGUpiCxJ04IluVt0NtnMAYUS0KaSK5rKBHTwWoYhRpLCNOguVUdp4x8aElSCab-FeEK7zcRCeuHU09MwP0oiIT5O_vpnu-iQwo0k07ImqxZdPfYPfMFQKnaQwX-Wl0tvjk7lo0Pi7_cRyvPMARNGos_9HZqCOHcf0btx6Orh5Dhmwglxkvzm0IXdotBjZVGV4PDMpTrBRk3k76aJZybsz3wmBGGcOzodO_09Q9sDm26sZlRvo3MJm24asg"/>
                <span className="absolute bottom-1 right-1 text-[8px] font-mono text-white/50">20150</span>
              </div>
              <div className="relative group cursor-pointer opacity-100 timeline-gradient p-1 rounded">
                <div className="flex items-center gap-1.5">
                  <img alt="Frame" className="w-32 h-18 object-cover rounded border-2 border-primary" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6C5kYDZtuJGpypOT0LOGUpiCxJ04IluVt0NtnMAYUS0KaSK5rKBHTwWoYhRpLCNOguVUdp4x8aElSCab-FeEK7zcRCeuHU09MwP0oiIT5O_vpnu-iQwo0k07ImqxZdPfYPfMFQKnaQwX-Wl0tvjk7lo0Pi7_cRyvPMARNGos_9HZqCOHcf0btx6Orh5Dhmwglxkvzm0IXdotBjZVGV4PDMpTrBRk3k76aJZybsz3wmBGGcOzodO_09Q9sDm26sZlRvo3MJm24asg"/>
                  <img alt="Frame" className="w-32 h-18 object-cover rounded border border-white/10" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6C5kYDZtuJGpypOT0LOGUpiCxJ04IluVt0NtnMAYUS0KaSK5rKBHTwWoYhRpLCNOguVUdp4x8aElSCab-FeEK7zcRCeuHU09MwP0oiIT5O_vpnu-iQwo0k07ImqxZdPfYPfMFQKnaQwX-Wl0tvjk7lo0Pi7_cRyvPMARNGos_9HZqCOHcf0btx6Orh5Dhmwglxkvzm0IXdotBjZVGV4PDMpTrBRk3k76aJZybsz3wmBGGcOzodO_09Q9sDm26sZlRvo3MJm24asg"/>
                </div>
                <span className="absolute bottom-1 right-2 text-[8px] font-mono text-white/80 font-bold">CURRENT: 20187</span>
              </div>
              <div className="relative group cursor-pointer opacity-40 hover:opacity-100 transition-opacity">
                <img alt="Frame" className="w-32 h-18 object-cover rounded-sm border border-white/5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC74r84HQq_EtJoFgQ-QqSoYOkK1CoCNyipbjZT0Lkbt_VPvGxpUdslROyEDkBL9NJr1I3Qori5UeYdeYv1rPG87I8s4egVzJdrx7y31HXC-c-8LkxSXc6f_CYin9zfbf7KPlcYxuRWeYixL_QE5UsiSR9soPmIkw5IX1MoFAGa80NMamgCf7ueAfTRVjes5TQlAVVn0qbazJuSu169-BHPoS0cCwM2iyLMCZ71nn-uthqv1qbCoYbXpZCR4QVvWIhfucegbeAxoPc"/>
                <span className="absolute bottom-1 right-1 text-[8px] font-mono text-white/50">20250</span>
              </div>
            </div>
            <div className="absolute top-1 left-[12%] w-1 h-1 bg-amber-500 rounded-full"></div>
            <div className="absolute top-1 left-[34%] w-1 h-1 bg-primary rounded-full"></div>
            <div className="absolute top-1 left-[65%] w-1 h-1 bg-emerald-500 rounded-full"></div>
          </div>
        </div>
      </section>
      <footer className="h-8 bg-black border-t border-border-subtle px-4 flex items-center justify-between text-[9px] font-bold text-slate-500 uppercase tracking-widest">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Review Session Active
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[12px]">cloud_done</span>
            All Changes Synced
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[12px]">groups</span>
            3 Active Reviewers
          </div>
          <div>Build v4.12.0-Production</div>
        </div>
      </footer>
    </div>
  );
};
