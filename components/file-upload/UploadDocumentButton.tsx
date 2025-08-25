// UploadDocumentButton.tsx
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { Text, TouchableOpacity, View, ActivityIndicator } from "react-native";

import { useFileSelector } from './useFileSelector';
import { FileInfo, FileUtilityService, CompressionOptions } from './fileUtilityService';

interface UploadDocumentButtonProps {
  title: string;
  description?: string;
  icon: keyof typeof Ionicons.glyphMap;
  onFileSelected: (title: string, files: FileInfo[]) => void;
  allowedTypes?: string[];
  maxFileSize?: number;
  multiple?: boolean;
  compress?: boolean;
  compressionOptions?: CompressionOptions;
}

const UploadDocumentButton: React.FC<UploadDocumentButtonProps> = ({
  title,
  description,
  icon,
  onFileSelected,
  allowedTypes = ["image/*", "application/pdf"],
  maxFileSize = 10 * 1024 * 1024,
  multiple = false,
  compress = true,
  compressionOptions,
}) => {
  const {
    selectedFiles,
    isLoading,
    error,
    pickFiles,
    removeFile,
    clearFiles
  } = useFileSelector({
    allowedTypes,
    maxFileSize,
    multiple,
    compress,
    compressionOptions
  });
  React.useEffect(() => {
  }, []);

  React.useEffect(() => {
    onFileSelected(title, selectedFiles);
  }, [selectedFiles, title, onFileSelected]);

  // Display the first file or a count if multiple files
  const displayText = () => {
    if (selectedFiles.length === 0) {
      return description || "Tap to browse files";
    } else if (selectedFiles.length === 1) {
      return selectedFiles[0].name;
    } else {
      return `${selectedFiles.length} files selected`;
    }
  };

  // Calculate total size of selected files
  const getTotalSize = () => {
    return selectedFiles.reduce((total, file) => total + (file.size || 0), 0);
  };

  return (
    <View style={{ marginVertical: 4 }}>
      <TouchableOpacity
        onPress={pickFiles}
        disabled={isLoading}
        className={`rounded-xl overflow-hidden ${selectedFiles.length > 0 ? "border-2 border-blue-500" : "border border-dashed border-gray-300"}`}
      >
        <LinearGradient
          colors={selectedFiles.length > 0 ? ['#EBF4FF', '#E6F0FD'] : ['#F9FAFB', '#F3F4F6']}
          className="p-4"
        >
          <View className="flex-row items-center">
            <View className={`w-10 h-10 rounded-full items-center justify-center ${selectedFiles.length > 0 ? "bg-blue-100" : "bg-gray-100"}`}>
              <Ionicons 
                name={selectedFiles.length > 0 ? "checkmark-circle" : icon} 
                size={24} 
                color={selectedFiles.length > 0 ? "#3B82F6" : "#6B7280"} 
              />
            </View>
            
            <View className="flex-1 ml-3">
              <Text className="text-gray-800 font-medium text-base">{title}</Text>
              
              {selectedFiles.length > 0 ? (
                <Animated.View entering={FadeIn} exiting={FadeOut} className="mt-2">
                  <Text className="text-blue-600 font-medium" numberOfLines={1} ellipsizeMode="middle">
                    {displayText()}
                  </Text>
                  {multiple && selectedFiles.length > 1 && (
                    <Text className="text-gray-500 text-xs mt-1">
                      {FileUtilityService.formatFileSize(getTotalSize())} total
                    </Text>
                  )}
                  {selectedFiles.length === 1 && selectedFiles[0].size && (
                    <Text className="text-gray-500 text-xs mt-1">
                      {FileUtilityService.formatFileSize(selectedFiles[0].size)}
                    </Text>
                  )}
                  <TouchableOpacity 
                    onPress={clearFiles}
                    className="mt-2 flex-row items-center"
                  >
                    <Ionicons name="trash-outline" size={14} color="#EF4444" />
                    <Text className="text-red-500 text-sm ml-1">
                      {multiple && selectedFiles.length > 1 ? "Remove all" : "Remove"}
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              ) : (
                <Text className="text-gray-500 text-sm mt-1">{description || "Tap to browse files"}</Text>
              )}
            </View>
            
            {isLoading && (
              <ActivityIndicator size="small" color="#3B82F6" />
            )}
          </View>
        </LinearGradient>
      </TouchableOpacity>
      
      {/* Display list of files if multiple selection is enabled and files are selected */}
      {multiple && selectedFiles.length > 1 && (
        <Animated.View entering={FadeIn} className="mt-2 ml-14">
          {selectedFiles.map((file, index) => (
            <View key={`${file.uri}-${index}`} className="flex-row items-center justify-between mt-1">
              <View className="flex-1 flex-row items-center">
                <Ionicons 
                  name={FileUtilityService.getFileExtension(file.name).toLowerCase() === 'pdf' ? "document-text" : "image"} 
                  size={16} 
                  color="#6B7280" 
                />
                <Text className="text-gray-600 text-xs ml-2 flex-1" numberOfLines={1} ellipsizeMode="middle">
                  {file.name}
                </Text>
                <Text className="text-gray-500 text-xs ml-1">
                  {FileUtilityService.formatFileSize(file.size)}
                </Text>
              </View>
              <TouchableOpacity 
                onPress={() => removeFile(index)}
                className="ml-2 p-1"
              >
                <Ionicons name="close-circle" size={16} color="#EF4444" />
              </TouchableOpacity>
            </View>
          ))}
        </Animated.View>
      )}
      
      {error && (
        <Animated.Text 
          entering={FadeIn}
          className="text-red-500 text-xs mt-2 pl-2"
        >
          {error}
        </Animated.Text>
      )}
    </View>
  );
};

export default React.memo(UploadDocumentButton);