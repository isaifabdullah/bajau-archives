/**
 * Blob Service - Handles file uploads to Vercel Blob
 * Works with Vercel deployment; falls back to base64 in dev
 */

interface UploadResponse {
  url: string;
}

export const blobService = {
  async uploadMusic(file: File): Promise<string> {
    try {
      const buffer = await file.arrayBuffer();
      const base64 = Buffer.from(buffer).toString('base64');
      
      const response = await fetch('/api/upload-music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          file: base64,
          filename: `music/${Date.now()}-${file.name.replace(/\s+/g, '-')}`
        })
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data: UploadResponse = await response.json();
      return data.url;
    } catch (error) {
      console.error('Error uploading music:', error);
      // Fallback: return base64 data URL for local development
      return URL.createObjectURL(file);
    }
  },

  async uploadImage(file: File): Promise<string> {
    try {
      const buffer = await file.arrayBuffer();
      const base64 = Buffer.from(buffer).toString('base64');

      const response = await fetch('/api/upload-music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          file: base64,
          filename: `images/${Date.now()}-${file.name.replace(/\s+/g, '-')}`
        })
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data: UploadResponse = await response.json();
      return data.url;
    } catch (error) {
      console.error('Error uploading image:', error);
      return URL.createObjectURL(file);
    }
  },

  async deleteFile(filename: string): Promise<void> {
    try {
      const response = await fetch('/api/upload-music', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename })
      });

      if (!response.ok) {
        throw new Error('Delete failed');
      }
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  }
};
