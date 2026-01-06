
import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Anchor, Mic2, ArrowRight } from 'lucide-react';

// EDIT THESE URLS TO CHANGE IMAGES MANUALLY
const HOME_IMAGES = {
  HERO_BG: "https://i.guim.co.uk/img/media/fe27aabf35683caa6b89f2781ee5d0ad9042e209/0_0_4800_3197/master/4800.jpg?width=1900&dpr=1&s=none&crop=none",
  TRADITIONAL_LIFE: "https://www.rehahnphotographer.com/wp-content/uploads/2015/03/Borneo-bajau-photo-rehahn.webp"
};

const Home: React.FC = () => {
  return (
    <div className="animate-fadeIn">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-sky-950/70 via-sky-900/50 to-teal-950/80 z-10" />
          
          <img 
            src={HOME_IMAGES.HERO_BG} 
            alt="Aerial view of Bajau boats" 
            className="w-full h-full object-cover scale-105"
          />
        </div>

        <div className="relative z-20 max-w-6xl mx-auto px-6 text-center">
          <div className="mb-8 inline-block animate-float">
            <span className="px-5 py-2.5 bg-white/10 backdrop-blur-xl rounded-full text-[10px] font-bold text-white uppercase tracking-[0.3em] border border-white/20">
              Digital Heritage Preservation
            </span>
          </div>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-extrabold text-white mb-8 leading-[0.95] tracking-tight-heading">
            Voices of the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-sky-200">Floating World</span>
          </h1>
          <p className="text-lg md:text-xl text-sky-50/80 mb-12 max-w-2xl mx-auto font-medium leading-relaxed tracking-wide">
            A secure digital sanctuary for the songs, stories, and rhythms of the Bajau Laut community. Bridging university coursework with indigenous soul.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link 
              to="/repository" 
              className="group bg-white text-sky-950 px-10 py-5 rounded-2xl font-bold transition-all hover:bg-teal-400 hover:text-white shadow-2xl flex items-center gap-2"
            >
              Explore Archive
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
            </Link>
            <Link 
              to="/ethics" 
              className="text-white font-bold hover:text-teal-300 transition-colors py-5 border-b-2 border-transparent hover:border-teal-300 tracking-wider"
            >
              Access & Protocol
            </Link>
          </div>
        </div>

        <div className="absolute bottom-20 left-10 opacity-10 hidden lg:block animate-float" style={{animationDelay: '1s'}}>
          <Anchor size={120} className="text-white" />
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-32 md:py-48 relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-8 leading-[1.1] tracking-tight-heading">
                More than music. <br />
                <span className="text-teal-600">A seafaring soul.</span>
              </h2>
              <p className="text-lg text-slate-500 leading-relaxed mb-10 font-medium">
                The Sama-Bajau culture is fluid. Their music doesn't just happen on land; it echoes across the waves, syncing with the tide. This archive captures the essence of their maritime heritage and unique ancestral traditions.
              </p>
              <div className="space-y-10">
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 bg-sky-50 rounded-2xl flex items-center justify-center text-sky-600 flex-shrink-0">
                    <Mic2 size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg mb-1 tracking-tight">Oral Histories</h4>
                    <p className="text-slate-500 font-medium leading-relaxed">Narratives that carry the coordinates of ancient sea-routes and genealogical ties.</p>
                  </div>
                </div>
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 flex-shrink-0">
                    <Compass size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg mb-1 tracking-tight">Cultural Compass</h4>
                    <p className="text-slate-500 font-medium leading-relaxed">Using music as a tool for community identity and resilience.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl">
                <img 
                  src={HOME_IMAGES.TRADITIONAL_LIFE} 
                  alt="Traditional Bajau Life" 
                  className="w-full h-full object-cover transition-all duration-700"
                />
              </div>
              <div className="absolute -bottom-10 -left-10 p-10 glass-card rounded-[2.5rem] shadow-xl max-w-sm border border-slate-100/50">
                <p className="text-slate-800 font-semibold text-lg leading-relaxed italic tracking-tight">"The water is our mother. Our songs are her heartbeat."</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
