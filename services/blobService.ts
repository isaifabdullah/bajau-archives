/**
 * Blob Service - Handles file uploads to Vercel Blob
 * Uses FormData multipart/form-data for efficient file transfer
 */

interface UploadResponse {
  url: string;
}

export const blobService = {
  async uploadMusic(file: File): Promise<string> {
    try {
      console.log('Starting music upload:', file.name, 'File size:', file.size, 'bytes');
      
      if (file.size > 100 * 1024 * 1024) { // 100MB limit
        throw new Error(`File too large (${(file.size / 1024 / 1024).toFixed(2)}MB). Maximum 100MB allowed.`);
      }
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('filename', `music/${Date.now()}-${file.name.replace(/\s+/g, '-')}`);
      
      const response = await fetch('/api/upload-music', {
        method: 'POST',
        body: formData
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
      console.log('Starting image upload:', file.name, 'File size:', file.size, 'bytes');
      
      if (file.size > 50 * 1024 * 1024) { // 50MB limit for images
        throw new Error(`Image too large (${(file.size / 1024 / 1024).toFixed(2)}MB). Maximum 50MB allowed.`);
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('filename', `images/${Date.now()}-${file.name.replace(/\s+/g, '-')}`);

      const response = await fetch('/api/upload-music', {
        method: 'POST',
        body: formData
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
