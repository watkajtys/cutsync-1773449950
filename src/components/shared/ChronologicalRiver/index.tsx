import React from 'react';

export const ChronologicalRiver: React.FC = () => {
  return (
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
  );
};
