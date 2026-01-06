
import React, { useState, useEffect } from 'react';
import { ADMIN_KEY } from '../constants';
import { CommunityStory } from '../types';
import { dataService } from '../services/dataService';
import { blobService } from '../services/blobService';
import { 
  BookOpen, ArrowRight, Plus, X, 
  ShieldCheck, Lock, ShieldAlert, Calendar, User, 
  ChevronLeft, Share2, Bookmark, Printer, Trash2, Loader2
} from 'lucide-react';

const Stories: React.FC = () => {
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [stories, setStories] = useState<CommunityStory[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedStory, setSelectedStory] = useState<CommunityStory | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  
  const [newStory, setNewStory] = useState<Partial<CommunityStory>>({
    title: '', author: '', excerpt: '', content: '', image: ''
  });

  useEffect(() => {
    const authRole = localStorage.getItem('bajau_access_role');
    setIsAdmin(authRole === 'admin');
    loadData();
  }, []);

  const loadData = async () => {
    setIsDataLoading(true);
    const data = await dataService.getStories();
    setStories(data);
    setIsDataLoading(false);
  };

  useEffect(() => {
    if (selectedStory) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [selectedStory]);

  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === ADMIN_KEY) {
      setIsAdmin(true);
      localStorage.setItem('bajau_access_role', 'admin');
      setAuthError('');
      setIsAuthModalOpen(false);
      setIsModalOpen(true);
    } else {
      setAuthError('Invalid Admin Key');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    try {
      const url = await blobService.uploadImage(file);
      setNewStory({ ...newStory, image: url });
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddStory = async (e: React.FormEvent) => {
    e.preventDefault();
    const storyToAdd: CommunityStory = {
      id: Date.now().toString(),
      title: newStory.title || 'Untitled Story',
      author: newStory.author || 'Contributor',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      excerpt: newStory.excerpt || '',
      content: newStory.content || '',
      image: newStory.image || 'https://images.unsplash.com/photo-1589197331516-4d84593e64e6?q=80&w=800'
    };
    
    await dataService.saveStory(storyToAdd);
    await loadData();
    setIsModalOpen(false);
    setNewStory({ title: '', author: '', excerpt: '', content: '', image: '' });
  };

  const handleRemoveStory = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await dataService.deleteStory(id);
    await loadData();
  };

  const openContribution = () => {
    if (isAdmin) {
      setIsModalOpen(true);
    } else {
      setIsAuthModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen pt-40 pb-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-32 relative">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-slate-50 text-slate-900 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-10 border border-slate-100">
            <BookOpen size={14} className="text-teal-500" />
            <span>Oral Histories</span>
            {isAdmin && <ShieldCheck size={14} className="text-teal-500 ml-2" />}
          </div>
          <h1 className="text-7xl md:text-8xl font-extrabold text-slate-950 mb-8 tracking-tight-heading">Community</h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed mb-12">
            The contexts behind the rhythms. Explore the shared memories of the Sama-Bajau people.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-6">
            <button 
              onClick={openContribution}
              className="bg-slate-950 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-teal-500 transition-all shadow-2xl shadow-slate-900/10"
            >
              <Plus size={20} />
              {isAdmin ? 'Submit New Story' : 'Contributor Access'}
            </button>
            
            {isAdmin && (
              <button 
                onClick={() => setIsDeleteMode(!isDeleteMode)}
                className={`px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3 border transition-all shadow-xl ${
                  isDeleteMode 
                  ? 'bg-rose-500 text-white border-rose-500 shadow-rose-500/20' 
                  : 'bg-white text-slate-600 border-slate-200 hover:border-rose-300 hover:text-rose-500'
                }`}
              >
                <Trash2 size={20} />
                {isDeleteMode ? 'Finish Removing' : 'Remove Article'}
              </button>
            )}
          </div>
        </div>

        {isDeleteMode && (
          <div className="mb-16 p-8 bg-rose-50 border border-rose-100 rounded-3xl flex items-center gap-4 text-rose-600 animate-fadeIn max-w-4xl mx-auto">
            <ShieldAlert size={24} />
            <p className="text-sm font-black uppercase tracking-[0.15em]">Removal Mode Active: Be careful, deletions are permanent and will be removed from the public archive.</p>
          </div>
        )}

        {isDataLoading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <div className="w-16 h-16 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin mb-6" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Accessing Cloud Archive...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-20">
            {stories.map((story) => (
              <article 
                key={story.id} 
                className={`group cursor-pointer relative transition-all duration-500 ${isDeleteMode ? 'scale-[0.98]' : 'hover:-translate-y-2'}`}
                onClick={() => !isDeleteMode && setSelectedStory(story)}
              >
                <div className={`aspect-[1.5] overflow-hidden rounded-[3rem] mb-10 shadow-2xl relative border-4 transition-colors duration-500 ${isDeleteMode ? 'border-rose-500/40' : 'border-transparent'}`}>
                  <img 
                    src={story.image} 
                    alt={story.title} 
                    className={`w-full h-full object-cover transition-transform duration-1000 ${isDeleteMode ? 'grayscale' : 'group-hover:scale-110'}`}
                  />
                  
                  {isDeleteMode && (
                    <div className="absolute inset-0 bg-rose-500/10 backdrop-blur-[2px] flex items-center justify-center">
                      <button 
                        onClick={(e) => handleRemoveStory(e, story.id)}
                        className="w-24 h-24 bg-rose-600 text-white rounded-full flex items-center justify-center shadow-2xl shadow-rose-600/40 hover:scale-110 active:scale-95 transition-all"
                      >
                        <Trash2 size={40} />
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-5 text-[10px] font-black text-teal-600 uppercase tracking-[0.3em] mb-8">
                  <span className="bg-slate-50 px-4 py-2 rounded-xl text-slate-500">{story.date}</span>
                  <span className="text-slate-200">•</span>
                  <span>By {story.author}</span>
                </div>
                <h3 className={`text-4xl md:text-5xl font-extrabold mb-8 transition-colors leading-[1.1] tracking-tight-heading ${isDeleteMode ? 'text-rose-900/40' : 'text-slate-950 group-hover:text-teal-600'}`}>
                  {story.title}
                </h3>
                <p className={`text-lg leading-relaxed mb-10 font-medium line-clamp-3 ${isDeleteMode ? 'text-slate-300' : 'text-slate-500'}`}>
                  {story.excerpt}
                </p>
                
                {!isDeleteMode && (
                  <div className="flex items-center gap-4 text-slate-950 font-black text-xs uppercase tracking-[0.3em] group-hover:gap-8 transition-all duration-500">
                    <span>Open Broadsheet</span>
                    <ArrowRight size={24} className="text-teal-500" />
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Full Page Newspaper View */}
      {selectedStory && (
        <div className="fixed inset-0 z-[200] bg-white overflow-y-auto animate-fadeIn">
          <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-slate-100 px-6 lg:px-12 py-6 flex justify-between items-center">
            <button 
              onClick={() => setSelectedStory(null)}
              className="flex items-center gap-2 text-slate-900 hover:text-teal-600 transition-colors group"
            >
              <ChevronLeft className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Back to Archive</span>
            </button>
            <div className="text-center absolute left-1/2 -translate-x-1/2 hidden md:block">
              <span className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-300">The Bajau Chronicles</span>
            </div>
            <div className="flex items-center gap-6">
              <button className="text-slate-400 hover:text-slate-900 transition-colors"><Share2 size={20} /></button>
              <button className="text-slate-400 hover:text-slate-900 transition-colors"><Bookmark size={20} /></button>
              <button className="text-slate-400 hover:text-slate-900 transition-colors"><Printer size={20} /></button>
            </div>
          </header>

          <article className="max-w-4xl mx-auto px-6 py-24">
            <div className="text-center mb-16 border-b-2 border-slate-900 pb-16">
              <div className="inline-flex items-center gap-4 text-[10px] font-black text-teal-600 uppercase tracking-[0.4em] mb-10">
                <span>Volume 1</span>
                <span className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
                <span>Issue 04</span>
                <span className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
                <span>Digital Heritage Series</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-extrabold text-slate-950 mb-12 leading-[0.95] tracking-tight-heading">
                {selectedStory.title}
              </h1>
              <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-950 rounded-full flex items-center justify-center text-white">
                    <User size={18} />
                  </div>
                  <div className="text-left">
                    <span className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">Byline</span>
                    <span className="font-bold text-slate-950">{selectedStory.author}</span>
                  </div>
                </div>
                <div className="h-10 w-px bg-slate-100 hidden md:block" />
                <div className="flex items-center gap-4 text-left">
                  <Calendar size={20} className="text-slate-300" />
                  <div>
                    <span className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">Date</span>
                    <span className="font-bold text-slate-950">{selectedStory.date}</span>
                  </div>
                </div>
              </div>
            </div>

            <figure className="mb-24">
              <div className="aspect-[21/9] overflow-hidden rounded-[2.5rem] shadow-2xl mb-6">
                <img src={selectedStory.image} alt={selectedStory.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-[2s]" />
              </div>
              <figcaption className="text-center text-slate-400 text-sm italic font-medium">Photo: Documentation of life on the Sulu Sea, 2026.</figcaption>
            </figure>

            <div className="newspaper-body text-slate-800 text-xl leading-[1.85] max-w-3xl mx-auto">
              <p className="text-slate-950 text-2xl font-bold mb-16 leading-relaxed border-l-4 border-teal-500 pl-8 italic bg-slate-50 py-8 pr-8 rounded-r-3xl">{selectedStory.excerpt}</p>
              <div className="drop-cap whitespace-pre-wrap">{selectedStory.content}</div>
              <div className="mt-12 pt-12 border-t border-slate-100">
                <p className="text-sm text-slate-400 font-bold uppercase tracking-[0.2em] mb-4">Research Note</p>
                <p className="text-base text-slate-500 italic">This narrative forms part of the Universiti Malaya collection on Digital Ethnography.</p>
              </div>
            </div>
          </article>
          
          <footer className="bg-slate-50 py-24 text-center">
            <div className="max-w-2xl mx-auto px-6">
              <h4 className="text-2xl font-bold text-slate-950 mb-6">Want to explore more?</h4>
              <p className="text-slate-500 mb-10 font-medium">Continue your journey through our archive of oral histories and recordings.</p>
              <button onClick={() => setSelectedStory(null)} className="bg-slate-950 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-teal-500 transition-all shadow-xl">Back to Grid</button>
            </div>
          </footer>
        </div>
      )}

      {/* Auth Modal */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setIsAuthModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-12 animate-slideUp">
            <button onClick={() => setIsAuthModalOpen(false)} className="absolute top-8 right-8 text-slate-300 hover:text-slate-900"><X size={32} /></button>
            <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-8 text-white"><Lock size={28} /></div>
            <h2 className="text-2xl font-extrabold text-slate-950 text-center mb-4 tracking-tight">Admin Authentication</h2>
            <form onSubmit={handleAdminAuth} className="space-y-6">
              <input type="password" placeholder="Admin Key" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} className="w-full bg-slate-50 border border-slate-100 px-6 py-5 rounded-2xl text-center text-xl font-black tracking-[0.2em]" />
              {authError && <div className="text-rose-500 text-sm font-bold bg-rose-50 p-3 rounded-xl text-center">{authError}</div>}
              <button type="submit" className="w-full bg-slate-950 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em]">Unlock</button>
            </form>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-3xl bg-white rounded-[3rem] shadow-2xl overflow-y-auto max-h-[90vh] p-12 md:p-16 animate-fadeIn">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-10 right-10 text-slate-300 hover:text-slate-900"><X size={40} /></button>
            <h2 className="text-4xl font-extrabold text-slate-950 mb-10 tracking-tight-heading">Submit New Story</h2>
            <form onSubmit={handleAddStory} className="grid gap-8">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Story Title</label>
                <input required className="w-full bg-slate-50 px-6 py-5 rounded-2xl border border-slate-100 font-bold" value={newStory.title} onChange={e => setNewStory({...newStory, title: e.target.value})} />
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Author Name</label>
                  <input required className="w-full bg-slate-50 px-6 py-5 rounded-2xl border border-slate-100 font-bold" value={newStory.author} onChange={e => setNewStory({...newStory, author: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Featured Image</label>
                  <div className="relative">
                    <input type="file" accept="image/*" onChange={handleImageUpload} disabled={isUploading} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                    <div className="w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl py-4 flex flex-col items-center justify-center text-slate-400 hover:border-teal-400 hover:text-teal-500 transition-all">
                      {isUploading ? (
                        <>
                          <Loader2 size={20} className="mb-1 animate-spin" />
                          <span className="text-[9px] font-black uppercase tracking-widest">Uploading...</span>
                        </>
                      ) : (
                        <>
                          <span className="text-[9px] font-black uppercase tracking-widest">{newStory.image ? 'Image Uploaded ✓' : 'Click to Upload'}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Excerpt</label>
                <textarea required rows={2} className="w-full bg-slate-50 px-6 py-5 rounded-2xl border border-slate-100 font-bold" value={newStory.excerpt} onChange={e => setNewStory({...newStory, excerpt: e.target.value})} />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Content</label>
                <textarea required rows={6} className="w-full bg-slate-50 px-6 py-5 rounded-2xl border border-slate-100 font-bold" value={newStory.content} onChange={e => setNewStory({...newStory, content: e.target.value})} />
              </div>
              <button type="submit" className="bg-slate-950 text-white py-6 rounded-2xl font-black text-sm uppercase tracking-[0.2em]">Publish Story</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stories;
