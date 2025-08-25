import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, Dimensions, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import ImageViewer from 'react-native-image-zoom-viewer'; // Install this library
import colors from 'tailwindcss/colors';
import LoadingIndicator from '@/components/ui/LoadingIndicator'; // Adjust path

interface VenuePhotosTabProps {
  photos: string[] | undefined | null; // Array of photo URLs
}

const NUM_COLUMNS = 2; // Adjust number of columns for the grid
const { width } = Dimensions.get('window');
const ITEM_SPACING = 12; // Spacing between items
const ITEM_WIDTH = (width - ITEM_SPACING * (NUM_COLUMNS + 1)) / NUM_COLUMNS;

const VenuePhotosTab: React.FC<VenuePhotosTabProps> = ({ photos }) => {
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [initialImageIndex, setInitialImageIndex] = useState(0);

  const handlePreview = useCallback((index: number) => {
    setInitialImageIndex(index);
    setIsPreviewVisible(true);
  }, []);

  const closePreview = useCallback(() => {
    setIsPreviewVisible(false);
  }, []);

  // Prepare images for ImageViewer format
  const imageViewerData = photos?.map(url => ({ url })) ?? [];

  const renderPhotoItem = ({ item, index }: { item: string; index: number }) => (
    <TouchableOpacity
      onPress={() => handlePreview(index)}
      style={{ width: ITEM_WIDTH, height: ITEM_WIDTH, marginBottom: ITEM_SPACING, marginLeft: ITEM_SPACING }}
      className="bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden shadow-sm"
    >
      <Image
        source={{ uri: item }}
        style={{ flex: 1 }}
        contentFit="cover"
        transition={300} // Smooth transition on load
        // placeholderContent={ // Show a placeholder while loading
        //      <View className="flex-1 justify-center items-center bg-gray-300 dark:bg-gray-600">
        //         <ActivityIndicator size="small" color={colors.gray[500]} />
        //      </View>
        // }
      />
    </TouchableOpacity>
  );

  if (!photos || photos.length === 0) {
    return (
        <View className="flex-1 justify-center items-center bg-gray-50 dark:bg-gray-950 p-4">
            <Ionicons name="images-outline" size={48} color={colors.gray[400]} />
            <Text className="text-gray-500 dark:text-gray-400 text-center mt-4">
            No photos available for this venue.
            </Text>
        </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-950 pt-4">
       {/* Add explicit left padding to the FlatList container to balance spacing */}
       <FlatList
            data={photos}
            renderItem={renderPhotoItem}
            keyExtractor={(item, index) => item + index}
            numColumns={NUM_COLUMNS}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100, paddingRight: ITEM_SPACING }} // Add right padding
       />

      {/* Image Viewer Modal */}
      <Modal visible={isPreviewVisible} transparent={true} onRequestClose={closePreview}>
          <ImageViewer
            imageUrls={imageViewerData}
            index={initialImageIndex}
            onCancel={closePreview}
            enableSwipeDown={true} // Allow swiping down to close
            renderHeader={() => ( // Custom header with close button
                <TouchableOpacity
                    className="absolute top-10 right-5 z-10 bg-black/40 p-2 rounded-full"
                    onPress={closePreview}
                >
                    <Ionicons name="close" size={24} color="#ffffff" />
                </TouchableOpacity>
            )}
             loadingRender={() => <ActivityIndicator size="large" color="#ffffff" />}
             enablePreload // Preload nearby images
             saveToLocalByLongPress={false} // Disable long press save if not needed
          />
      </Modal>
    </View>
  );
};

export default VenuePhotosTab;