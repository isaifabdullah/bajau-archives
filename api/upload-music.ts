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

      const buffer = Buffer.from(file, 'base64');
      const blob = await put(filename, buffer, {
        access: 'public',
      });

      return response.status(200).json({ url: blob.url });
    } catch (error) {
      console.error('Upload error:', error);
      return response.status(500).json({ error: 'Upload failed' });
    }
  } else if (request.method === 'DELETE') {
    try {
      const { filename } = request.body;

      if (!filename) {
        return response.status(400).json({ error: 'Missing filename' });
      }

      await del(filename);
      return response.status(200).json({ success: true });
    } catch (error) {
      console.error('Delete error:', error);
      return response.status(500).json({ error: 'Delete failed' });
    }
  }

  return response.status(405).json({ error: 'Method not allowed' });
}
