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

    const blob = await get(MANIFEST_KEY, {
      token: process.env.VERCEL_BLOB_READ_WRITE_TOKEN,
    });

    if (!blob) {
      console.log('Manifest file does not exist yet');
      return [];
    }

    const text = await blob.text();
    if (!text) return [];
    
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed : [];
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
      console.log('GET /api/songs');
      const songs = await getSongsFromManifest();
      return response.status(200).json({ songs });
    }

    // POST - add new song
    if (request.method === 'POST') {
      console.log('POST /api/songs');
      
      if (!process.env.VERCEL_BLOB_READ_WRITE_TOKEN) {
        return response.status(503).json({ 
          error: 'Blob storage not configured. Please enable Vercel Blob storage.' 
        });
      }

      const song: Song = {
        ...request.body,
        id: Date.now().toString(),
        createdAt: Date.now(),
      };

      console.log('Adding song:', song.id);

      // Get existing songs
      const songs = await getSongsFromManifest();

      // Add new song to the beginning
      const updatedSongs = [song, ...songs];

      // Save back
      await saveSongsToManifest(updatedSongs);

      console.log('Song added successfully:', song.id);
      return response.status(201).json({ success: true, song });
    }

    // DELETE - remove song
    if (request.method === 'DELETE') {
      console.log('DELETE /api/songs');
      
      if (!process.env.VERCEL_BLOB_READ_WRITE_TOKEN) {
        return response.status(503).json({ 
          error: 'Blob storage not configured.' 
        });
      }

      const { id } = request.query;

      if (!id) {
        return response.status(400).json({ error: 'Missing song ID' });
      }

      console.log('Deleting song:', id);

      // Get existing songs
      const songs = await getSongsFromManifest();

      // Filter out the song to delete
      const updatedSongs = songs.filter(s => s.id !== id);

      // Save back
      await saveSongsToManifest(updatedSongs);

      console.log('Song deleted successfully:', id);
      return response.status(200).json({ success: true });
    }

    return response.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('API Error:', errorMessage);
    console.error('Full error:', error);

    if (errorMessage.includes('VERCEL_BLOB') || errorMessage.includes('not configured')) {
      return response.status(503).json({ 
        error: 'Blob storage not configured. Please check your Vercel project settings.' 
      });
    }

    return response.status(500).json({ error: `Server error: ${errorMessage}` });
  }
}

