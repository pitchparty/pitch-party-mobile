import { useState } from 'react';
import * as DocumentPicker from 'expo-document-picker';

import { FileInfo, FileUtilityService, CompressionOptions } from './fileUtilityService';

interface FileSelectorOptions {
  allowedTypes?: string[];
  maxFileSize?: number;
  multiple?: boolean;
  compress?: boolean;
  compressionOptions?: CompressionOptions;
}

interface FileSelectorReturn {
  selectedFiles: FileInfo[];
  isLoading: boolean;
  error: string | null;
  pickFiles: () => Promise<void>;
  removeFile: (index?: number) => void;
  clearFiles: () => void;
}

export const useFileSelector = (
  options: FileSelectorOptions = {}
): FileSelectorReturn => {
  const {
    allowedTypes = ["image/*", "application/pdf"],
    maxFileSize = 10 * 1024 * 1024, // 10MB default
    multiple = false,
    compress = false,
    compressionOptions = {
      quality: 0.7,
      maxWidth: 1200,
      maxHeight: 1200,
    }
  } = options;

  const [selectedFiles, setSelectedFiles] = useState<FileInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pickFiles = async (): Promise<void> => {
    try {
      setError(null);
      setIsLoading(true);
      
      const result = await DocumentPicker.getDocumentAsync({
        type: allowedTypes,
        copyToCacheDirectory: true,
        multiple,
      });
      
      if (result.canceled) {
        setIsLoading(false);
        return;
      }
      
      const files = result.assets;
      const oversizedFiles = files.filter(file => file.size && file.size > maxFileSize);
      
      if (oversizedFiles.length > 0) {
        setError(`${oversizedFiles.length} file(s) exceed the maximum size of ${maxFileSize / (1024 * 1024)}MB`);
        setIsLoading(false);
        return;
      }
      
      // Convert DocumentPicker results to FileInfo objects
      let newFiles: FileInfo[] = files.map(file => ({
        name: file.name,
        uri: file.uri,
        size: file.size,
        type: file.mimeType,
        mimeType: file.mimeType
      }));
      
      // Compress images if enabled
      if (compress) {
        const compressPromises = newFiles.map(async file => {
          if (FileUtilityService.isImageFile(file)) {
            return await FileUtilityService.compressImage(file, compressionOptions);
          }
          return file;
        });
        
        newFiles = await Promise.all(compressPromises);
      }
      
      // If multiple, add to existing files, otherwise replace
      const updatedFiles = multiple 
        ? [...selectedFiles, ...newFiles] 
        : newFiles;
      
      setSelectedFiles(updatedFiles);
    } catch (err) {
      setError("An error occurred while selecting the file(s)");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const removeFile = (index?: number): void => {
    if (index !== undefined) {
      // Remove a specific file
      const newFiles = [...selectedFiles];
      newFiles.splice(index, 1);
      setSelectedFiles(newFiles);
    } else {
      // Clear all files
      clearFiles();
    }
  };

  const clearFiles = (): void => {
    setSelectedFiles([]);
    setError(null);
  };

  return {
    selectedFiles,
    isLoading,
    error,
    pickFiles,
    removeFile,
    clearFiles
  };
};