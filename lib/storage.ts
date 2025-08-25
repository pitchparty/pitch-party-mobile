import { supabase } from './supabase';
import * as FileSystem from 'expo-file-system';

export const uploadToStorage = async (uri: string, path: string) => {
  try {
    // Get file info
    const fileInfo = await FileSystem.getInfoAsync(uri);
    if (!fileInfo.exists) {
      throw new Error('File does not exist');
    }
    
    // Read file as base64
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    
    // Convert base64 to blob
    const blob = Buffer.from(base64, 'base64');
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('venue-documents')
      .upload(path, blob, {
        contentType: 'application/octet-stream',
        upsert: true,
      });
      
    if (error) throw error;
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('venue-documents')
      .getPublicUrl(path);
      
    return { url: publicUrl, error: null };
  } catch (error) {
    console.error('Error uploading file:', error);
    return { url: null, error };
  }
};