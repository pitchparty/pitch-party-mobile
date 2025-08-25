import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useVenueImages } from '../hooks'; // Adjust path if needed
import DocumentPreviewModal from './DocumentPreviewModal';
import LoadingIndicator from '@/components/ui/LoadingIndicator'; // Adjust path
import ErrorMessage from '@/components/ui/ErrorMessage'; // Adjust path
import colors from 'tailwindcss/colors';
import { VenueDocument } from '../types';

interface VenueDocumentsTabProps {
  venueId: string;
}

const VenueDocumentsTab: React.FC<VenueDocumentsTabProps> = ({ venueId }) => {
  const {
    data: documents,
    isPending,
    isError,
    error,
    refetch,
  } = useVenueImages(venueId);

  const [previewVisible, setPreviewVisible] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);

  const handlePreview = useCallback((url: string) => {
    setSelectedUrl(url);
    setPreviewVisible(true);
  }, []);

  const closePreview = useCallback(() => {
    setPreviewVisible(false);
    setSelectedUrl(null);
  }, []);

  // Helper function to format document type names
  const formatDocumentType = (type: string): string => {
    return type
      .replace(/[-_]/g, ' ') // Replace hyphens and underscores with spaces
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Helper function to get appropriate icon
  const getIconName = (docType: string, mimeType?: string): React.ComponentProps<typeof Ionicons>['name'] => {
     // Prioritize mimeType if available
     if (mimeType?.includes('pdf')) return 'document-text-outline';
     if (mimeType?.includes('image')) return 'image-outline';
     // Fallback based on type name
     if (docType.toLowerCase().includes('image') || docType.toLowerCase().includes('photo')) return 'image-outline';
     if (docType.toLowerCase().includes('pdf') || docType.toLowerCase().includes('document')) return 'document-text-outline';
    return 'document-outline'; // Default icon
  };

  const renderDocumentItem = ({ item }: { item: VenueDocument }) => (
    <View className="bg-white dark:bg-gray-800 rounded-xl mb-4 shadow-md overflow-hidden">
      <View className="p-4 border-b border-gray-100 dark:border-gray-700">
          <View className="flex-row items-center">
              <Ionicons
                  name={getIconName(item.document_type, "")}
                  size={26}
                  color={colors.blue[600]}
                  className="mr-4"
              />
              <View className="flex-1">
                  <Text className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  {formatDocumentType(item.document_type)}
                  </Text>
                  {/* {item.mimeType && (
                       <Text className="text-sm text-gray-500 dark:text-gray-400">
                           {item.mimeType}
                       </Text>
                  )} */}
              </View>
          </View>
      </View>
      <View className="p-4 space-y-2">
         {/* Handle single or multiple asset URLs */}
         {(Array.isArray(item.asset_url) ? item.asset_url : [item.asset_url]).map((url, index) => (
            <TouchableOpacity
                key={index}
                className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg flex-row items-center justify-between"
                onPress={() => handlePreview(url)}
            >
               <View className="flex-row items-center flex-1 mr-2">
                   <Ionicons
                       name={url.toLowerCase().endsWith('.pdf') ? "document-text-outline" : "image-outline"}
                       size={18}
                       color={colors.blue[600]}
                       className="mr-2"
                    />
                    <Text className="text-blue-700 dark:text-blue-300 text-sm flex-shrink" numberOfLines={1}>
                      {/* Show a generic name or part of the URL */}
                      {/* Preview File {index + 1} ({url.split('.').pop()}) */}
                    </Text>
                </View>
                <Ionicons
                    name="chevron-forward-outline"
                    size={18}
                    color={colors.blue[600]}
                />
            </TouchableOpacity>
         ))}
      </View>
    </View>
  );


  if (isPending) return <LoadingIndicator message="Loading documents..." />;
  if (isError) return <ErrorMessage message="Could not load documents." error={error} onRetry={refetch} />;

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-950 pt-4 px-4">
      <FlatList
        data={documents}
        renderItem={renderDocumentItem}
        keyExtractor={(item) => item?.id || item.document_type} // Use ID if available
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center mt-20">
             <Ionicons name="cloud-offline-outline" size={48} color={colors.gray[400]} />
            <Text className="text-gray-500 dark:text-gray-400 text-center mt-4">
              No documents have been uploaded for this venue yet.
            </Text>
          </View>
        }
      />
      <DocumentPreviewModal visible={previewVisible} onClose={closePreview} url={selectedUrl} />
    </View>
  );
};

export default VenueDocumentsTab;
