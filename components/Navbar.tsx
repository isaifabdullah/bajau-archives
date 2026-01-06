
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Waves } from 'lucide-react';

const Navbar: React.FC = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;
  const isHomePage = location.pathname === '/';
  
  const isDarkText = !isHomePage && !scrolled;
  const textColor = isDarkText ? 'text-slate-800' : 'text-white';
  const brandColor = isDarkText ? 'text-slate-900' : 'text-white';
  const badgeBorder = isDarkText ? 'border-slate-900/10' : 'border-white/20';
  const badgeText = isDarkText ? 'text-slate-500' : 'text-white';

  const navLinks = [
    { name: 'Archive', path: '/repository' },
    { name: 'Stories', path: '/stories' },
    { name: 'Team', path: '/team' },
    { name: 'Ethics', path: '/ethics' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? 'py-5 bg-slate-950/90 backdrop-blur-xl shadow-lg border-b border-white/5' : 'py-8 bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="p-2.5 bg-teal-500 rounded-xl group-hover:rotate-12 transition-transform duration-500 shadow-lg shadow-teal-500/20">
              <Waves className="text-white" size={22} />
            </div>
            <span className={`brand text-xl font-bold tracking-tight transition-colors duration-500 ${brandColor}`}>Bajau Archives</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-[11px] uppercase font-bold tracking-[0.15em] transition-all hover:text-teal-500 relative py-2 ${
                  isActive(link.path) 
                    ? 'text-teal-500' 
                    : `${textColor} opacity-70 hover:opacity-100`
                }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-teal-500/60 rounded-full" />
                )}
              </Link>
            ))}
          </div>

          <div className="hidden lg:block">
            <div className={`text-[10px] font-bold uppercase tracking-[0.2em] border px-4 py-2 rounded-xl transition-all duration-500 ${badgeBorder} ${badgeText}`}>
              Universiti Malaya
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
