
import React from 'react';
import { ShieldCheck, EyeOff, Scale, Users, Waves } from 'lucide-react';

const Ethics: React.FC = () => {
  return (
    <div className="min-h-screen pt-40 pb-24 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-slate-50 text-slate-900 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-10 border border-slate-100">
          <ShieldCheck size={14} className="text-teal-500" />
          <span>Research Protocol</span>
        </div>
        <h1 className="text-7xl md:text-8xl font-extrabold text-slate-900 mb-12 tracking-tight-heading">Ethics</h1>
        
        <div className="space-y-24">
          <p className="text-xl md:text-2xl text-slate-500 leading-relaxed font-medium max-w-4xl">
            The Bajau Archives is a <strong className="text-slate-900 font-bold">closed digital repository</strong>. This ensures that indigenous cultural expressions are protected from exploitation.
          </p>

          <div className="grid sm:grid-cols-2 gap-8">
            <div className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100 hover:border-teal-200 transition-all group">
              <div className="w-14 h-14 bg-white text-teal-600 rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:bg-teal-500 group-hover:text-white transition-all duration-500">
                <Waves size={24} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">Cultural Sensitivity</h3>
              <p className="text-slate-500 font-medium text-sm leading-relaxed">Many of these songs hold spiritual weight. Unrestricted access could lead to rhythms being used out of context.</p>
            </div>
            <div className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100 hover:border-teal-200 transition-all group">
              <div className="w-14 h-14 bg-white text-teal-600 rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:bg-teal-500 group-hover:text-white transition-all duration-500">
                <EyeOff size={24} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">Privacy Rights</h3>
              <p className="text-slate-500 font-medium text-sm leading-relaxed">Performers have given consent for academic research only, not for commercial broadcast.</p>
            </div>
            <div className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100 hover:border-teal-200 transition-all group">
              <div className="w-14 h-14 bg-white text-teal-600 rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:bg-teal-500 group-hover:text-white transition-all duration-500">
                <Scale size={24} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">Decolonial Archiving</h3>
              <p className="text-slate-500 font-medium text-sm leading-relaxed">We challenge the notion that all knowledge must be "open." Control remains with the community.</p>
            </div>
            <div className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100 hover:border-teal-200 transition-all group">
              <div className="w-14 h-14 bg-white text-teal-600 rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:bg-teal-500 group-hover:text-white transition-all duration-500">
                <Users size={24} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">Community Sovereignty</h3>
              <p className="text-slate-500 font-medium text-sm leading-relaxed">The Bajau community has the final say on what is shared and how it is labeled.</p>
            </div>
          </div>

          <div className="bg-slate-950 rounded-[4rem] p-16 md:p-24 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-[100px] -mr-40 -mt-40" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-12 tracking-tight">How to Request Access</h2>
              
              <div className="grid gap-10">
                {[
                  "Submit a research proposal explaining your study goals.",
                  "Sign the Digital Data Usage Agreement (DDUA).",
                  "Attend a briefing on cultural sensitivity protocols."
                ].map((step, i) => (
                  <div key={i} className="flex gap-8 items-center group">
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 text-teal-400 flex items-center justify-center font-bold text-lg flex-shrink-0 group-hover:bg-teal-500 group-hover:text-white transition-all duration-500">
                      {i + 1}
                    </div>
                    <p className="text-lg text-slate-300 font-medium">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ethics;
