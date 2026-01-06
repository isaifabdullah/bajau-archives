
import React, { useState, useEffect, useRef } from 'react';
import { ACCESS_KEY, ADMIN_KEY } from '../constants';
import { Song } from '../types';
import { dataService } from '../services/dataService';
import { blobService } from '../services/blobService';
import { 
  Lock, Play, Pause, Music, Waves, ShieldAlert, 
  Plus, X, LogOut, ShieldCheck, Upload, Volume2, Trash2,
  Search, Loader2, Volume, VolumeX, SkipBack, SkipForward
} from 'lucide-react';

const Repository: React.FC = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [songs, setSongs] = useState<Song[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const [newSong, setNewSong] = useState<Partial<Song>>({
    title: '', genre: '', performer: '', description: '', duration: '', origin: '', audioUrl: ''
  });

  useEffect(() => {
    // Don't check localStorage - go straight to the repository
    setIsAuthorized(false);
    loadData();
    
    // Refresh data every 5 seconds for real-time sync across browsers
    const interval = setInterval(() => {
      loadData();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleError = (e: Event) => {
      console.error('Audio error:', (e.target as HTMLAudioElement).error);
      setIsPlaying(false);
      alert('Error loading audio. The file may be invalid or inaccessible.');
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const data = await dataService.getSongs();
    setSongs(data);
    setIsLoading(false);
  };

  const handleAccess = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_KEY) {
      setIsAuthorized(true);
      setIsAdmin(true);
      setError('');
    } else {
      setError('Invalid password. Please try again.');
    }
  };

  const handleLogout = () => {
    setIsAuthorized(false);
    setIsAdmin(false);
    setIsDeleteMode(false);
    if (audioRef.current) audioRef.current.pause();
    setIsPlaying(false);
    setCurrentSong(null);
    setPassword('');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    try {
      const url = await blobService.uploadMusic(file);
      setNewSong({ ...newSong, audioUrl: url });
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Failed to upload music file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddSong = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const songToAdd: Song = {
        id: Date.now().toString(),
        title: newSong.title || 'Untitled',
        genre: newSong.genre || 'Traditional',
        performer: newSong.performer || 'Unknown',
        description: newSong.description || '',
        duration: newSong.duration || '0:00',
        origin: newSong.origin || 'Unknown',
        audioUrl: newSong.audioUrl || ''
      };
      
      await dataService.saveSong(songToAdd);
      await loadData(); // Refresh immediately
      setIsModalOpen(false);
      setNewSong({ title: '', genre: '', performer: '', description: '', duration: '', origin: '', audioUrl: '' });
      alert('Song added successfully!');
    } catch (error) {
      alert(`Failed to add song: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleRemoveSong = async (id: string) => {
    try {
      await dataService.deleteSong(id);
      await loadData(); // Refresh immediately
      if (currentSong?.id === id) {
        audioRef.current?.pause();
        setIsPlaying(false);
        setCurrentSong(null);
      }
      alert('Song deleted successfully!');
    } catch (error) {
      alert(`Failed to delete song: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const togglePlay = (song: Song) => {
    if (currentSong?.id === song.id) {
      if (isPlaying) {
        audioRef.current?.pause();
      } else {
        audioRef.current?.play().catch(err => {
          console.error('Playback error:', err);
          alert('Unable to play audio. File may not be available or there may be a CORS issue.');
        });
      }
    } else {
      if (!song.audioUrl) {
        alert('No audio file available for this song.');
        return;
      }
      setCurrentSong(song);
      if (audioRef.current) {
        audioRef.current.src = song.audioUrl;
        audioRef.current.volume = volume;
        audioRef.current.load();
        audioRef.current.play().catch(err => {
          console.error('Playback error:', err);
          console.error('Trying to play:', song.audioUrl);
          alert('Unable to play audio. The file may be invalid or inaccessible. Check browser console (F12) for details.');
        });
      }
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    if (newVolume > 0) setIsMuted(false);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const skipTo = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(Math.max(0, currentTime + seconds), duration);
    }
  };

  const formatTime = (time: number) => {
    if (!isFinite(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // --- Search Logic ---
  const filteredSongs = songs.filter(song => {
    const q = searchQuery.toLowerCase();
    return (
      song.title.toLowerCase().includes(q) ||
      song.performer.toLowerCase().includes(q) ||
      song.genre.toLowerCase().includes(q)
    );
  });

  if (!isAuthorized) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-6 flex items-center justify-center bg-white">
        <div className="max-w-xl w-full">
          <div className="glass-card rounded-[3rem] overflow-hidden shadow-2xl border border-slate-100 p-10 md:p-16 text-center">
            <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center mx-auto mb-10 animate-float shadow-2xl shadow-slate-900/10">
              <Lock className="text-white" size={30} />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Restricted Archive</h2>
            <p className="text-slate-500 mb-10 leading-relaxed font-medium">
              This repository is protected to ensure cultural preservation. Please enter your access key to proceed.
            </p>
            <form onSubmit={handleAccess} className="space-y-6">
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Access Key"
                className="w-full bg-slate-50 px-8 py-5 rounded-2xl border border-slate-100 focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:bg-white transition-all text-center text-xl font-bold tracking-[0.2em] placeholder:tracking-normal placeholder:font-medium"
              />
              {error && (
                <div className="flex items-center justify-center gap-2 text-rose-500 text-sm font-semibold bg-rose-50 p-4 rounded-xl">
                  <ShieldAlert size={16} />
                  {error}
                </div>
              )}
              <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold text-[11px] uppercase tracking-[0.15em] hover:bg-teal-600 transition-all">
                Enter Repository
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-40 pb-40 bg-white">
      <audio 
        ref={audioRef} 
        crossOrigin="anonymous"
        preload="metadata"
        controls={false}
      />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div>
            <div className="inline-flex items-center gap-3 text-teal-600 font-bold text-[10px] uppercase tracking-[0.2em] mb-6">
              <Waves size={16} />
              <span>{isAdmin ? 'ADMINISTRATOR ACCESS' : 'RESEARCHER ACCESS'}</span>
              {isAdmin && <ShieldCheck size={14} className="text-teal-500" />}
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-4 tracking-tight-heading">Repository</h1>
            <p className="text-slate-500 font-medium">Digital collection of Sama-Bajau audio heritage.</p>
          </div>
          <div className="flex flex-wrap gap-4">
            {isAdmin && (
              <>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="px-8 py-4 bg-teal-500 text-white rounded-2xl font-bold text-[11px] uppercase tracking-[0.15em] flex items-center gap-3 hover:bg-teal-600 transition-all shadow-xl shadow-teal-500/20"
                >
                  <Plus size={18} />
                  Add Recording
                </button>
                <button 
                  onClick={() => setIsDeleteMode(!isDeleteMode)}
                  className={`px-8 py-4 rounded-2xl font-bold text-[11px] uppercase tracking-[0.15em] flex items-center gap-3 transition-all border shadow-lg ${
                    isDeleteMode 
                    ? 'bg-rose-500 text-white border-rose-500 shadow-rose-500/20' 
                    : 'bg-white text-slate-600 border-slate-200 hover:border-rose-300 hover:text-rose-500'
                  }`}
                >
                  <Trash2 size={18} />
                  {isDeleteMode ? 'Finish Removing' : 'Remove Recording'}
                </button>
              </>
            )}
            <button onClick={handleLogout} className="px-8 py-4 bg-white border border-slate-200 text-slate-900 rounded-2xl font-bold text-[11px] uppercase tracking-[0.15em] flex items-center gap-3 hover:bg-slate-50 transition-all">
              <LogOut size={18} />
              End Session
            </button>
          </div>
        </div>

        {/* Search Bar Section */}
        <div className="mb-16 relative">
          <div className="absolute inset-y-0 left-8 flex items-center pointer-events-none">
            <Search className="text-slate-400" size={20} />
          </div>
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, performer, or genre..."
            className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] py-6 pl-16 pr-8 text-lg font-medium text-slate-900 focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:bg-white transition-all shadow-sm"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-8 flex items-center text-slate-400 hover:text-slate-900 transition-colors"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {isDeleteMode && (
          <div className="mb-10 p-6 bg-rose-50 border border-rose-100 rounded-3xl flex items-center gap-4 text-rose-600 animate-fadeIn">
            <ShieldAlert size={20} />
            <p className="text-sm font-bold uppercase tracking-widest">Removal Mode Active: Be careful, deletions are permanent.</p>
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <div className="w-16 h-16 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin mb-6" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Accessing Cloud Archive...</p>
          </div>
        ) : filteredSongs.length > 0 ? (
          <div className="grid lg:grid-cols-2 gap-8">
            {filteredSongs.map((song) => (
              <div key={song.id} className={`group relative overflow-hidden bg-white rounded-[2.5rem] border p-8 transition-all hover:shadow-2xl ${
                isDeleteMode ? 'border-rose-200 hover:border-rose-400' : 
                currentSong?.id === song.id ? 'border-teal-500 ring-4 ring-teal-500/5' : 'border-slate-100 hover:border-teal-100'
              }`}>
                <div className="relative z-10 flex flex-col sm:flex-row gap-8 items-start sm:items-center">
                  <div className={`w-32 h-32 rounded-[2rem] flex-shrink-0 flex items-center justify-center transition-all duration-700 ${
                    isDeleteMode ? 'bg-rose-50 text-rose-300' : 'bg-slate-50 text-slate-300 group-hover:text-teal-500 group-hover:bg-teal-50'
                  }`}>
                    <Music size={40} />
                  </div>
                  
                  <div className="flex-grow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className={`text-[10px] font-bold uppercase tracking-[0.15em] mb-1 block ${isDeleteMode ? 'text-rose-400' : 'text-teal-600'}`}>
                          {song.genre}
                        </span>
                        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{song.title}</h3>
                        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{song.performer}</p>
                      </div>
                      
                      <div className="flex gap-2">
                        {isDeleteMode ? (
                          <button 
                            onClick={() => handleRemoveSong(song.id)}
                            className="w-14 h-14 bg-rose-500 text-white rounded-2xl flex items-center justify-center hover:bg-rose-600 hover:scale-110 active:scale-95 transition-all shadow-lg shadow-rose-500/20"
                            title="Remove from Archive"
                          >
                            <Trash2 size={24} />
                          </button>
                        ) : (
                          <button 
                            onClick={() => togglePlay(song)}
                            className={`w-14 h-14 rounded-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg ${currentSong?.id === song.id && isPlaying ? 'bg-teal-500 text-white' : 'bg-slate-900 text-white hover:bg-teal-500'}`}
                          >
                            {currentSong?.id === song.id && isPlaying ? <Pause size={24} /> : <Play fill="currentColor" size={24} className="ml-0.5" />}
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed line-clamp-2">{song.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-40 text-center bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-slate-300">
              <Search size={30} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No recordings found</h3>
            <p className="text-slate-500 font-medium">We couldn't find anything matching "{searchQuery}" in our archive.</p>
            <button 
              onClick={() => setSearchQuery('')}
              className="mt-8 text-teal-600 font-bold uppercase text-[10px] tracking-widest hover:text-teal-700 transition-colors"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>

      {/* Global Player Bar */}
      {currentSong && !isDeleteMode && (
        <div className="fixed bottom-10 left-6 right-6 z-50 animate-slideUp">
          <div className="max-w-4xl mx-auto glass-card rounded-[2.5rem] p-6 shadow-2xl border border-white/50 flex flex-col gap-5">
            {/* Progress Bar */}
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-slate-500 min-w-10 text-right">
                {formatTime(currentTime)}
              </span>
              <input 
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleProgressChange}
                className="flex-grow h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-teal-500 hover:accent-teal-600 transition-all"
                style={{
                  background: duration ? `linear-gradient(to right, rgb(20, 184, 166) 0%, rgb(20, 184, 166) ${(currentTime / duration) * 100}%, rgb(226, 232, 240) ${(currentTime / duration) * 100}%, rgb(226, 232, 240) 100%)` : ''
                }}
              />
              <span className="text-[10px] font-bold text-slate-500 min-w-10">
                {formatTime(duration)}
              </span>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-teal-400 flex-shrink-0">
                  <Music size={20} className={isPlaying ? 'animate-pulse' : ''} />
                </div>
                <div className="min-w-0">
                  <h4 className="text-slate-900 font-bold tracking-tight text-sm truncate">{currentSong.title}</h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest truncate">{currentSong.performer}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Skip Back */}
                <button 
                  onClick={() => skipTo(-5)}
                  className="w-10 h-10 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center hover:bg-teal-100 hover:text-teal-600 transition-colors hidden sm:flex"
                  title="Skip back 5 seconds"
                >
                  <SkipBack size={16} />
                </button>

                {/* Play/Pause */}
                <button 
                  onClick={() => togglePlay(currentSong)}
                  className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-teal-600 active:scale-95 transition-all shadow-lg"
                >
                  {isPlaying ? <Pause size={20} /> : <Play fill="currentColor" size={20} className="ml-0.5" />}
                </button>

                {/* Skip Forward */}
                <button 
                  onClick={() => skipTo(5)}
                  className="w-10 h-10 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center hover:bg-teal-100 hover:text-teal-600 transition-colors hidden sm:flex"
                  title="Skip forward 5 seconds"
                >
                  <SkipForward size={16} />
                </button>

                {/* Volume Control */}
                <div className="flex items-center gap-2 hidden md:flex">
                  <button 
                    onClick={toggleMute}
                    className="w-10 h-10 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center hover:bg-teal-100 hover:text-teal-600 transition-colors"
                  >
                    {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume size={16} />}
                  </button>
                  <input 
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-24 h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-teal-500 hover:accent-teal-600"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Recording Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden p-10 md:p-14 animate-fadeIn">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-10 right-10 text-slate-300 hover:text-slate-900">
              <X size={32} />
            </button>
            <h2 className="text-3xl font-bold text-slate-900 mb-10 tracking-tight">Add Recording</h2>
            <form onSubmit={handleAddSong} className="grid md:grid-cols-2 gap-8">
              <div className="col-span-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-3">Song Title</label>
                <input required className="w-full bg-slate-50 px-6 py-4 rounded-xl border border-slate-100 font-semibold focus:ring-4 focus:ring-teal-500/10 focus:outline-none transition-all" value={newSong.title} onChange={e => setNewSong({...newSong, title: e.target.value})} />
              </div>
              <div className="col-span-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-3">Audio File</label>
                <div className="relative">
                  <input type="file" accept="audio/*" onChange={handleFileUpload} disabled={isUploading} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                  <div className="w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl py-6 flex flex-col items-center justify-center text-slate-400 hover:border-teal-400 hover:text-teal-500 transition-all">
                    {isUploading ? (
                      <>
                        <Loader2 size={24} className="mb-2 animate-spin" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload size={24} className="mb-2" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">{newSong.audioUrl ? 'File Uploaded ✓' : 'Click to Upload MP3'}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-3">Genre</label>
                <input required className="w-full bg-slate-50 px-6 py-4 rounded-xl border border-slate-100 font-semibold focus:ring-4 focus:ring-teal-500/10 focus:outline-none transition-all" value={newSong.genre} onChange={e => setNewSong({...newSong, genre: e.target.value})} />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-3">Performer</label>
                <input required className="w-full bg-slate-50 px-6 py-4 rounded-xl border border-slate-100 font-semibold focus:ring-4 focus:ring-teal-500/10 focus:outline-none transition-all" value={newSong.performer} onChange={e => setNewSong({...newSong, performer: e.target.value})} />
              </div>
              <button type="submit" className="col-span-2 bg-slate-900 text-white py-5 rounded-2xl font-bold text-[11px] uppercase tracking-[0.15em] hover:bg-teal-500 transition-all shadow-xl">
                Save to Archive
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Repository;
