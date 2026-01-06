
import { Song, CommunityStory } from '../types';
import { STORIES } from '../constants';

export const dataService = {
  // --- SONGS ---
  async getSongs(): Promise<Song[]> {
    try {
      const response = await fetch('/api/songs');
      if (!response.ok) {
        throw new Error(`Failed to fetch songs: ${response.statusText}`);
      }
      const data = await response.json();
      return data.songs || [];
    } catch (error) {
      console.error('Error fetching songs:', error);
      return [];
    }
  },

  async saveSong(song: Song): Promise<void> {
    try {
      const response = await fetch('/api/songs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(song)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save song');
      }

      console.log('Song saved:', song.id);
    } catch (error) {
      console.error('Error saving song:', error);
      throw error;
    }
  },

  async deleteSong(id: string): Promise<void> {
    try {
      const response = await fetch(`/api/songs?id=${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete song');
      }

      console.log('Song deleted:', id);
    } catch (error) {
      console.error('Error deleting song:', error);
      throw error;
    }
  },

  // --- STORIES ---
  async getStories(): Promise<CommunityStory[]> {
    // Stories are static for now - can be migrated to KV later
    return STORIES;
  },

  async saveStory(story: CommunityStory): Promise<void> {
    // TODO: Implement KV storage for stories
    console.log('Story save not yet implemented:', story.id);
  },

  async deleteStory(id: string): Promise<void> {
    // TODO: Implement KV storage for stories
    console.log('Story delete not yet implemented:', id);
  }
};
