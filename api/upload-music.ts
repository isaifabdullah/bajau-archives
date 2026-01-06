import { put, del } from '@vercel/blob';
import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
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

      const buffer = Buffer.from(file, 'base64');
      const blob = await put(filename, buffer, {
        access: 'public',
        token: process.env.VERCEL_BLOB_READ_WRITE_TOKEN,
      });

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
