import { put, del } from '@vercel/blob';
import { VercelRequest, VercelResponse } from '@vercel/node';

// Increase body parser limit for larger files
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '100mb', // Allow up to 100MB files
    },
  },
};

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  // Set CORS headers
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'POST, DELETE, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  if (request.method === 'POST') {
    try {
      const { file, filename } = request.body;

      if (!file || !filename) {
        return response.status(400).json({ error: 'Missing file or filename' });
      }

      // Check if VERCEL_BLOB_READ_WRITE_TOKEN is configured
      if (!process.env.VERCEL_BLOB_READ_WRITE_TOKEN) {
        console.error('VERCEL_BLOB_READ_WRITE_TOKEN not configured');
        return response.status(500).json({ 
          error: 'Storage not configured. Please set VERCEL_BLOB_READ_WRITE_TOKEN in Vercel project settings.' 
        });
      }

      console.log(`Uploading file: ${filename}, size: ${file.length} bytes`);

      const buffer = Buffer.from(file, 'base64');
      
      // Check buffer size
      if (buffer.length > 100 * 1024 * 1024) {
        return response.status(413).json({ error: 'File too large. Maximum 100MB allowed.' });
      }

      const blob = await put(filename, buffer, {
        access: 'public',
        token: process.env.VERCEL_BLOB_READ_WRITE_TOKEN,
      });

      console.log(`Upload successful: ${blob.url}`);
      return response.status(200).json({ url: blob.url });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Upload error:', errorMessage);
      return response.status(500).json({ error: `Upload failed: ${errorMessage}` });
    }
  } else if (request.method === 'DELETE') {
    try {
      const { filename } = request.body;

      if (!filename) {
        return response.status(400).json({ error: 'Missing filename' });
      }

      if (!process.env.VERCEL_BLOB_READ_WRITE_TOKEN) {
        return response.status(500).json({ error: 'Storage not configured' });
      }

      await del(filename, {
        token: process.env.VERCEL_BLOB_READ_WRITE_TOKEN,
      });
      return response.status(200).json({ success: true });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Delete error:', errorMessage);
      return response.status(500).json({ error: `Delete failed: ${errorMessage}` });
    }
  }

  return response.status(405).json({ error: 'Method not allowed' });
}
