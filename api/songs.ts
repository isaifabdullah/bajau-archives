import { kv } from '@vercel/kv';
import { VercelRequest, VercelResponse } from '@vercel/node';

export const config = {
  maxDuration: 60,
};

interface Song {
  id: string;
  title: string;
  genre: string;
  performer: string;
  description: string;
  duration: string;
  origin: string;
  audioUrl: string;
  createdAt: number;
}

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  // Set CORS headers
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  try {
    // GET all songs
    if (request.method === 'GET') {
      const songs = await kv.get('bajau_songs');
      return response.status(200).json({ songs: songs || [] });
    }

    // POST - add new song
    if (request.method === 'POST') {
      const song: Song = {
        ...request.body,
        id: Date.now().toString(),
        createdAt: Date.now(),
      };

      // Get existing songs
      const existingSongs = (await kv.get('bajau_songs')) as Song[] || [];

      // Add new song to the beginning
      const updatedSongs = [song, ...existingSongs];

      // Save back to KV
      await kv.set('bajau_songs', updatedSongs);

      console.log('Song added:', song.id);
      return response.status(201).json({ success: true, song });
    }

    // DELETE - remove song
    if (request.method === 'DELETE') {
      const { id } = request.query;

      if (!id) {
        return response.status(400).json({ error: 'Missing song ID' });
      }

      // Get existing songs
      const existingSongs = (await kv.get('bajau_songs')) as Song[] || [];

      // Filter out the song to delete
      const updatedSongs = existingSongs.filter(s => s.id !== id);

      // Save back to KV
      await kv.set('bajau_songs', updatedSongs);

      console.log('Song deleted:', id);
      return response.status(200).json({ success: true });
    }

    return response.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Database error:', errorMessage);
    
    // Check if it's a KV connection issue
    if (errorMessage.includes('KV') || errorMessage.includes('VERCEL')) {
      return response.status(503).json({ 
        error: 'Database not configured. Please enable Vercel KV in your project settings.' 
      });
    }

    return response.status(500).json({ error: `Server error: ${errorMessage}` });
  }
}
