
import { Song, CommunityStory } from '../types';
import { SONGS_MOCK, STORIES } from '../constants';

export const dataService = {
  // --- SONGS ---
  async getSongs(): Promise<Song[]> {
    const local = localStorage.getItem('bajau_songs');
    return local ? JSON.parse(local) : SONGS_MOCK;
  },

  async saveSong(song: Song): Promise<void> {
    const songs = await this.getSongs();
    const updated = [song, ...songs];
    localStorage.setItem('bajau_songs', JSON.stringify(updated));
  },

  async deleteSong(id: string): Promise<void> {
    const songs = await this.getSongs();
    const updated = songs.filter(s => s.id !== id);
    localStorage.setItem('bajau_songs', JSON.stringify(updated));
  },

  // --- STORIES ---
  async getStories(): Promise<CommunityStory[]> {
    const local = localStorage.getItem('bajau_stories');
    return local ? JSON.parse(local) : STORIES;
  },

  async saveStory(story: CommunityStory): Promise<void> {
    const stories = await this.getStories();
    const updated = [story, ...stories];
    localStorage.setItem('bajau_stories', JSON.stringify(updated));
  },

  async deleteStory(id: string): Promise<void> {
    const stories = await this.getStories();
    const updated = stories.filter(s => s.id !== id);
    localStorage.setItem('bajau_stories', JSON.stringify(updated));
  }
};
