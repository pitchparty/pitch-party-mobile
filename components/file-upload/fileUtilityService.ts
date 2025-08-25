// fileUtilityService.ts
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';

export interface FileInfo {
  name: string;
  uri: string;
  size?: number;
  type?: string;
  mimeType?: string;
}

export interface CompressionOptions {
  quality?: number; // 0 to 1, where 1 is highest quality
  maxWidth?: number;
  maxHeight?: number;
  format?: 'jpeg' | 'png';
}

const defaultCompressionOptions: CompressionOptions = {
  quality: 0.7,
  maxWidth: 1200,
  maxHeight: 1200,
  format: 'jpeg'
};

export class FileUtilityService {
  /**
   * Format file size to human-readable string
   */
  static formatFileSize(bytes?: number): string {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  /**
   * Get file extension from file name or URI
   */
  static getFileExtension(fileName: string): string {
    return fileName.split('.').pop()?.toLowerCase() || '';
  }

  /**
   * Check if a file is an image based on its extension or MIME type
   */
  static isImageFile(file: FileInfo): boolean {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
    const extension = this.getFileExtension(file.name);
    
    if (file.mimeType) {
      return file.mimeType.startsWith('image/');
    }
    
    return imageExtensions.includes(extension);
  }

  /**
   * Compress an image file
   */
  static async compressImage(
    fileInfo: FileInfo, 
    options: CompressionOptions = defaultCompressionOptions
  ): Promise<FileInfo> {
    if (!this.isImageFile(fileInfo)) {
      return fileInfo;
    }

    try {
      // Ensure ImageManipulator directory exists
      const manipulatorDir = FileSystem.cacheDirectory + 'ImageManipulator/';
      const dirInfo = await FileSystem.getInfoAsync(manipulatorDir);

      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(manipulatorDir, { intermediates: true });
      }

      const manipulatorOptions = {
        compress: options.quality || defaultCompressionOptions.quality,
        format: options.format || defaultCompressionOptions.format,
      };

      const manipulateActions = [];

      if (options.maxWidth && options.maxHeight) {
        manipulateActions.push({
          resize: {
            width: options.maxWidth,
            height: options.maxHeight,
          },
        });
      }

      const result = await ImageManipulator.manipulateAsync(
        fileInfo.uri,
        manipulateActions,
        // @ts-ignore
        manipulatorOptions
      );

      const fileInfo2 = await FileSystem.getInfoAsync(result.uri);
      const uriParts = fileInfo.uri.split('/');
      const fileName = uriParts[uriParts.length - 1];

      return {
        name: fileName,
        uri: result.uri,
        // @ts-ignore
        size: fileInfo2.size,
        type: fileInfo.type,
        mimeType: `image/${options.format || 'jpeg'}`
      };
    } catch (error) {
      console.error('Error compressing image:', error);
      return fileInfo;
    }
  }

  /**
   * Get file info from URI
   */
  static async getFileInfo(uri: string, name?: string): Promise<FileInfo> {
    try {
      const fileInfo = await FileSystem.getInfoAsync(uri);

      let fileName = name;
      if (!fileName) {
        const uriParts = uri.split('/');
        fileName = uriParts[uriParts.length - 1];
      }

      return {
        name: fileName,
        uri: uri,
        // @ts-ignore
        size: fileInfo.size,
      };
    } catch (error) {
      console.error('Error getting file info:', error);
      return { name: name || 'Unknown', uri: uri };
    }
  }
}
