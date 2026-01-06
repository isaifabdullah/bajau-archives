import { put, del } from '@vercel/blob';
import { VercelRequest, VercelResponse } from '@vercel/node';
import { IncomingForm } from 'formidable';
import * as fs from 'fs';

// Configure for file uploads
export const config = {
  api: {
    bodyParser: false, // Disable automatic body parsing for multipart
  },
  maxDuration: 60,
};

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  // Set CORS headers
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'POST, DELETE, OPTIONS, PUT');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  if (request.method === 'POST') {
    try {
      // Check if VERCEL_BLOB_READ_WRITE_TOKEN is configured
      if (!process.env.VERCEL_BLOB_READ_WRITE_TOKEN) {
        console.warn('VERCEL_BLOB_READ_WRITE_TOKEN not configured - using fallback');
        // Fallback: return a mock URL that won't actually play but allows testing the UI
        const mockUrl = `https://vercel.com/docs/storage/vercel-blob`;
        console.log('Fallback upload (no Blob storage):', mockUrl);
        return response.status(200).json({ url: mockUrl });
      }

      const form = new IncomingForm();
      const { fields, files } = await new Promise<{ fields: Record<string, string[]>; files: Record<string, any[]> }>((resolve, reject) => {
        form.parse(request, (err, fields, files) => {
          if (err) reject(err);
          else resolve({ fields, files });
        });
      });

      const file = files.file?.[0];
      const filename = Array.isArray(fields.filename) ? fields.filename[0] : fields.filename;

      if (!file || !filename) {
        return response.status(400).json({ error: 'Missing file or filename' });
      }

      console.log(`Uploading file: ${filename}`);

      const fileBuffer = fs.readFileSync(file.filepath);
      
      // Check file size (100MB limit)
      if (fileBuffer.length > 100 * 1024 * 1024) {
        return response.status(413).json({ error: `File too large (${(fileBuffer.length / 1024 / 1024).toFixed(2)}MB). Maximum 100MB allowed.` });
      }

      const blob = await put(filename, fileBuffer, {
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
      let body: any;
      if (typeof request.body === 'string') {
        body = JSON.parse(request.body);
      } else {
        body = request.body;
      }

      const { filename } = body;

      if (!filename) {
        return response.status(400).json({ error: 'Missing filename' });
      }

      // If Blob storage is configured, attempt deletion
      if (process.env.VERCEL_BLOB_READ_WRITE_TOKEN) {
        try {
          await del(filename, {
            token: process.env.VERCEL_BLOB_READ_WRITE_TOKEN,
          });
        } catch (error) {
          console.warn('Blob delete failed (may not exist):', error);
        }
      }

      return response.status(200).json({ success: true });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Delete error:', errorMessage);
      return response.status(500).json({ error: `Delete failed: ${errorMessage}` });
    }
  }

  return response.status(405).json({ error: 'Method not allowed' });
}
