
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.tsx';
import ScrollToTop from './components/ScrollToTop.tsx';
import Home from './pages/Home.tsx';
import Team from './pages/Team.tsx';
import Repository from './pages/Repository.tsx';
import Stories from './pages/Stories.tsx';
import Ethics from './pages/Ethics.tsx';

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/team" element={<Team />} />
            <Route path="/repository" element={<Repository />} />
            <Route path="/stories" element={<Stories />} />
            <Route path="/ethics" element={<Ethics />} />
          </Routes>
        </main>
        
        <footer className="bg-slate-950 text-slate-500 py-16 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-8 md:mb-0 text-center md:text-left">
                <span className="brand text-2xl font-black text-white tracking-tighter">Bajau Archives</span>
                <p className="text-sm mt-3 font-medium opacity-80 uppercase tracking-widest text-teal-500">
                  WIX2001 THINKING AND COMMUNICATION SKILLS
                </p>
              </div>
            </div>
            <div className="mt-12 pt-12 border-t border-white/5 text-[11px] leading-relaxed text-center md:text-left font-medium max-w-4xl opacity-50">
              This digital archive is built for academic purposes and community preservation at Universiti Malaya. 
              The songs and narratives contained herein remain the intellectual and cultural property of the respective performers and the Bajau community.
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
