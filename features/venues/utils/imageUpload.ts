import { supabase } from '@/lib/supabase';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';

type ImageUploadOptions = {
  bucket?: string;
  filePrefix?: string;
  maxWidth?: number;
  maxHeight?: number;
  compressionQuality?: number;
};

export class ImageUploadService {
  private static defaultOptions: ImageUploadOptions = {
    bucket: 'venue-images',
    filePrefix: 'venue_',
    maxWidth: 1200,
    maxHeight: 1200,
    compressionQuality: 0.8
  };

  // Resize and compress image
  private static async processImage(
    uri: string, 
    options: ImageUploadOptions
  ): Promise<string> {
    try {
      // Check if we need to resize
      const resizedImage = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { 
            width: options.maxWidth, 
            height: options.maxHeight 
          } 
        }],
        { 
          compress: options.compressionQuality, 
          format: ImageManipulator.SaveFormat.JPEG 
        }
      );
      return resizedImage.uri;
    } catch (error) {
      console.error('Image processing error:', error);
      return uri;
    }
  }

  // Upload single image
  static async uploadImage(
    localUri: string, 
    options: ImageUploadOptions = {}
  ): Promise<string | null> {
    const mergedOptions = { ...this.defaultOptions, ...options };
    
    try {
      // Process image
      const processedUri = await this.processImage(localUri, mergedOptions);
      
      // Read file
      const base64 = await FileSystem.readAsStringAsync(processedUri, { 
        encoding: FileSystem.EncodingType.Base64 
      });
      
      // Generate unique filename
      const fileName = `${mergedOptions.filePrefix}${Date.now()}.jpg`;
      const filePath = `${fileName}`;

      // Upload to Supabase storage
      const { data, error } = await supabase.storage
        .from(mergedOptions?.bucket!)
        .upload(filePath, decode(base64), {
          contentType: 'image/jpeg',
          upsert: true
        });

      if (error) throw error;

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from(mergedOptions.bucket!)
        .getPublicUrl(filePath);

      return publicUrlData.publicUrl;
    } catch (error) {
      console.error('Image upload error:', error);
      return null;
    }
  }

  // Upload multiple images
  static async uploadImages(
    localUris: string[], 
    options: ImageUploadOptions = {}
  ): Promise<string[]> {
    const uploadPromises = localUris.map(uri => 
      this.uploadImage(uri, options)
    );
    
    const uploadedUrls = await Promise.all(uploadPromises);
    return uploadedUrls.filter((url): url is string => url !== null);
  }

  // Delete image
  static async deleteImage(
    publicUrl: string, 
    options: ImageUploadOptions = {}
  ): Promise<boolean> {
    const mergedOptions = { ...this.defaultOptions, ...options };
    
    try {
      // Extract filename from public URL
      const fileName = publicUrl.split('/').pop();
      if (!fileName) throw new Error('Invalid URL');

      const { error } = await supabase.storage
        .from(mergedOptions.bucket!)
        .remove([fileName]);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Image deletion error:', error);
      return false;
    }
  }
}

// Utility to decode base64
function decode(base64: string) {
  return Buffer.from(base64, 'base64');
}