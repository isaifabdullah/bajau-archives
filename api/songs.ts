import { put, get, del } from '@vercel/blob';
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

const MANIFEST_KEY = 'bajau-songs-manifest.json';

async function getSongsFromManifest(): Promise<Song[]> {
  try {
    if (!process.env.VERCEL_BLOB_READ_WRITE_TOKEN) {
      console.warn('Blob storage not configured');
      return [];
    }

    const response = await get(MANIFEST_KEY, {
      token: process.env.VERCEL_BLOB_READ_WRITE_TOKEN,
    });

    if (!response) return [];

    const text = await response.text();
    return JSON.parse(text);
  } catch (error) {
    console.log('Manifest file not found or error reading:', error);
    return [];
  }
}

async function saveSongsToManifest(songs: Song[]): Promise<void> {
  if (!process.env.VERCEL_BLOB_READ_WRITE_TOKEN) {
    throw new Error('Blob storage not configured');
  }

  await put(MANIFEST_KEY, JSON.stringify(songs, null, 2), {
    access: 'private',
    token: process.env.VERCEL_BLOB_READ_WRITE_TOKEN,
  });
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
      const songs = await getSongsFromManifest();
      return response.status(200).json({ songs });
    }

    // POST - add new song
    if (request.method === 'POST') {
      const song: Song = {
        ...request.body,
        id: Date.now().toString(),
        createdAt: Date.now(),
      };

      // Get existing songs
      const songs = await getSongsFromManifest();

      // Add new song to the beginning
      const updatedSongs = [song, ...songs];

      // Save back
      await saveSongsToManifest(updatedSongs);

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
      const songs = await getSongsFromManifest();

      // Filter out the song to delete
      const updatedSongs = songs.filter(s => s.id !== id);

      // Save back
      await saveSongsToManifest(updatedSongs);

      console.log('Song deleted:', id);
      return response.status(200).json({ success: true });
    }

    return response.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Database error:', errorMessage);

    if (errorMessage.includes('Blob') || errorMessage.includes('not configured')) {
      return response.status(503).json({ 
        error: 'Storage not configured. Please check VERCEL_BLOB_READ_WRITE_TOKEN.' 
      });
    }

    return response.status(500).json({ error: `Server error: ${errorMessage}` });
  }
}

