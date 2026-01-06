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

async function getSongsFromManifest(): Promise<Song[]> {
  try {
    if (!process.env.VERCEL_BLOB_READ_WRITE_TOKEN) {
      console.warn('Blob storage not configured');
      return [];
    }

    let blob;
    try {
      blob = await get(MANIFEST_KEY, {
        token: process.env.VERCEL_BLOB_READ_WRITE_TOKEN,
      });
    } catch (getError) {
      // File doesn't exist yet - return empty array
      console.log('Manifest file does not exist yet (first time)');
      return [];
    }

    if (!blob) {
      console.log('Manifest file is null');
      return [];
    }

    // blob is already a BlobAccessor object with .text() method
    let text = '';
    if (typeof blob === 'string') {
      text = blob;
    } else if (blob && typeof blob.text === 'function') {
      text = await blob.text();
    } else if (blob && blob.toString) {
      text = blob.toString();
    }
    
    if (!text || text.trim() === '') {
      console.log('Manifest file is empty');
      return [];
    }
    
    const parsed = JSON.parse(text);
    if (!Array.isArray(parsed)) {
      console.warn('Manifest is not an array, returning empty');
      return [];
    }
    
    return parsed;
  } catch (error) {
    console.error('Error reading manifest:', error);
    return [];
  }
}

  try {
    // GET all songs
    if (request.method === 'GET') {
      console.log('[GET /api/songs] Starting...');
      try {
        const songs = await getSongsFromManifest();
        console.log('[GET /api/songs] Returning', songs.length, 'songs');
        return response.status(200).json({ songs });
      } catch (getError) {
        console.error('[GET /api/songs] Error:', getError);
        throw getError;
      }
    }

    // POST - add new song
    if (request.method === 'POST') {
      console.log('[POST /api/songs] Starting...');
      
      if (!process.env.VERCEL_BLOB_READ_WRITE_TOKEN) {
        console.error('[POST] Blob token not configured');
        return response.status(503).json({ 
          error: 'Blob storage not configured. Please enable Vercel Blob storage.' 
        });
      }

      console.log('[POST] Request body:', JSON.stringify(request.body).substring(0, 100));

      const song: Song = {
        ...request.body,
        id: Date.now().toString(),
        createdAt: Date.now(),
      };

      console.log('[POST] Creating song with ID:', song.id);

      try {
        // Get existing songs
        const songs = await getSongsFromManifest();
        console.log('[POST] Retrieved', songs.length, 'existing songs');

        // Add new song to the beginning
        const updatedSongs = [song, ...songs];
        console.log('[POST] Updated songs array to', updatedSongs.length, 'items');

        // Save back
        await saveSongsToManifest(updatedSongs);
        console.log('[POST] Saved to manifest successfully');

        return response.status(201).json({ success: true, song });
      } catch (postError) {
        console.error('[POST] Error during save:', postError);
        throw postError;
      }
    }

    // DELETE - remove song
    if (request.method === 'DELETE') {
      console.log('[DELETE /api/songs] Starting...');
      
      if (!process.env.VERCEL_BLOB_READ_WRITE_TOKEN) {
        console.error('[DELETE] Blob token not configured');
        return response.status(503).json({ 
          error: 'Blob storage not configured.' 
        });
      }

      const { id } = request.query;
      console.log('[DELETE] Song ID:', id);

      if (!id) {
        return response.status(400).json({ error: 'Missing song ID' });
      }

      try {
        // Get existing songs
        const songs = await getSongsFromManifest();
        console.log('[DELETE] Retrieved', songs.length, 'songs');

        // Filter out the song to delete
        const updatedSongs = songs.filter(s => s.id !== id);
        console.log('[DELETE] Filtered to', updatedSongs.length, 'songs');

        // Save back
        await saveSongsToManifest(updatedSongs);
        console.log('[DELETE] Saved to manifest successfully');

        return response.status(200).json({ success: true });
      } catch (deleteError) {
        console.error('[DELETE] Error during delete:', deleteError);
        throw deleteError;
      }
    }

    console.log('[API] Method not allowed:', request.method);
    return response.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('[API Handler] Caught error:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[API Handler] Error message:', errorMessage);
    console.error('[API Handler] Error stack:', error instanceof Error ? error.stack : 'N/A');

    if (errorMessage.includes('VERCEL_BLOB') || errorMessage.includes('not configured')) {
      return response.status(503).json({ 
        error: 'Blob storage not configured. Please check your Vercel project settings.' 
      });
    }

    return response.status(500).json({ error: `Server error: ${errorMessage}` });
  }

