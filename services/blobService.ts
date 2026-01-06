/**
 * Blob Service - Handles file uploads to Vercel Blob
 * Works with Vercel deployment; uses browser-compatible base64 encoding
 */

interface UploadResponse {
  url: string;
}

// Convert ArrayBuffer to base64 string (browser-compatible)
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export const blobService = {
  async uploadMusic(file: File): Promise<string> {
    try {
      console.log('Starting music upload:', file.name, 'Size:', file.size);
      
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        throw new Error('File too large. Maximum 50MB allowed.');
      }
      
      const buffer = await file.arrayBuffer();
      const base64 = arrayBufferToBase64(buffer);
      
      const response = await fetch('/api/upload-music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          file: base64,
          filename: `music/${Date.now()}-${file.name.replace(/\s+/g, '-')}`
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData.error || `Upload failed with status ${response.status}`;
        console.error('Upload response error:', response.status, errorMsg);
        throw new Error(errorMsg);
      }

      const data: UploadResponse = await response.json();
      console.log('Upload successful:', data.url);
      return data.url;
    } catch (error) {
      console.error('Error uploading music:', error);
      alert(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  },

  async uploadImage(file: File): Promise<string> {
    try {
      console.log('Starting image upload:', file.name, 'Size:', file.size);
      
      if (file.size > 10 * 1024 * 1024) { // 10MB limit for images
        throw new Error('Image too large. Maximum 10MB allowed.');
      }

      const buffer = await file.arrayBuffer();
      const base64 = arrayBufferToBase64(buffer);

      const response = await fetch('/api/upload-music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          file: base64,
          filename: `images/${Date.now()}-${file.name.replace(/\s+/g, '-')}`
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData.error || `Upload failed with status ${response.status}`;
        console.error('Upload response error:', response.status, errorMsg);
        throw new Error(errorMsg);
      }

      const data: UploadResponse = await response.json();
      console.log('Image upload successful:', data.url);
      return data.url;
    } catch (error) {
      console.error('Error uploading image:', error);
      alert(`Image upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
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
