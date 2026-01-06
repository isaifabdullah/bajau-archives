
import React from 'react';
import { TEAM_MEMBERS } from '../constants';
import { Mail, GraduationCap, ChevronRight, BookOpen, Cpu, Camera } from 'lucide-react';

const Team: React.FC = () => {
  return (
    <div className="min-h-screen pt-40 pb-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header Section */}
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-slate-50 text-slate-900 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-10 border border-slate-100">
            <GraduationCap size={14} className="text-teal-500" />
            <span>Universiti Malaya • WIX2001</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-extrabold text-slate-900 mb-8 tracking-tight-heading">Our Collective</h1>
          <p className="text-lg md:text-xl text-slate-500 max-w-3xl mx-auto font-medium leading-relaxed">
            A collaborative group of 9 student members exploring the intersection of maritime heritage and digital storytelling for the WIX2001 THINKING AND COMMUNICATION SKILLS module.
          </p>
        </div>

        {/* Group Mission Statement */}
        <div className="mb-32 grid lg:grid-cols-3 gap-12 border-y border-slate-100 py-20">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-teal-600 mb-2">
              <BookOpen size={20} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Cultural Narrative</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">Story Documentation</h3>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">
              Our content specialists focus on gathering cultural narratives, ensuring that every song and story is presented with respect to its original context and meaning.
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-teal-600 mb-2">
              <Cpu size={20} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Project Infrastructure</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">Digital Archiving</h3>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">
              The technical team manages the digital environment, building a secure and accessible platform to showcase Bajau heritage within a modern web framework.
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-teal-600 mb-2">
              <Camera size={20} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Media Presentation</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">Visual Storytelling</h3>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">
              Media processors handle the visual and audio assets, creating a compelling aesthetic experience that honors the seafaring traditions of the Sama-Bajau.
            </p>
          </div>
        </div>

        {/* Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
          {TEAM_MEMBERS.map((member, idx) => (
            <div 
              key={idx} 
              className="group relative bg-slate-50/50 hover:bg-white border border-slate-100 p-10 rounded-[2.5rem] transition-all duration-500 hover:shadow-2xl hover:shadow-teal-500/5 hover:-translate-y-1"
            >
              {member.role === 'Team Leader' && (
                <div className="absolute top-8 right-8 w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
              )}
              
              <div className="mb-8">
                <span className="inline-block px-4 py-1.5 bg-teal-50 text-teal-600 rounded-lg text-[9px] font-bold uppercase tracking-[0.15em] mb-4 group-hover:bg-teal-500 group-hover:text-white transition-colors duration-500">
                  {member.role}
                </span>
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight leading-tight group-hover:text-teal-600 transition-colors duration-500">
                  {member.name}
                </h3>
              </div>
              
              <p className="text-slate-500 text-sm leading-relaxed font-medium mb-10 min-h-[4rem]">
                {member.description}
              </p>
              
              <div className="pt-8 border-t border-slate-100">
                <a 
                  href={`mailto:${member.email}`}
                  className="flex items-center justify-between text-slate-400 group-hover:text-slate-900 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Mail size={16} className="group-hover:text-teal-500 transition-colors" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">{member.email.split('@')[0]}</span>
                  </div>
                  <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Updated Footer Section */}
        <div className="mt-48 bg-slate-950 rounded-[4rem] p-16 md:p-24 text-white shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px] -mr-48 -mt-48" />
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16">
            <div className="max-w-xl text-center lg:text-left">
              <h3 className="text-4xl font-extrabold mb-8 italic tracking-tight">Project Acknowledgment</h3>
              <p className="text-lg text-slate-300 leading-relaxed font-medium">
                This digital archive is a collaborative project by 9 students from Universiti Malaya. We thank our course instructor and the Bajau community; it is their rich and enduring culture that inspired this digital initiative to celebrate and honor the maritime traditions of the Sama-Bajau.
              </p>
            </div>
            <div className="flex flex-col items-center lg:items-end gap-3 opacity-20">
              <div className="text-2xl font-bold tracking-tight text-white uppercase">Universiti Malaya</div>
              <div className="text-[9px] font-bold tracking-[0.4em] text-teal-400 uppercase">WIX2001 Group Project</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Team;
