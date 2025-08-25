import React, { useState, useEffect } from 'react';
import { Modal, View, TouchableOpacity, ActivityIndicator, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import Pdf from 'react-native-pdf';
import colors from 'tailwindcss/colors'; // Assuming you use tailwind colors

interface DocumentPreviewModalProps {
  visible: boolean;
  onClose: () => void;
  url: string | null;
}

const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({ visible, onClose, url }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (visible && url) {
      setIsLoading(true);
      setIsError(false);
    }
  }, [visible, url]);

  const renderContent = () => {
    if (!url) return null;

    const isPdf = url.toLowerCase().endsWith('.pdf');

    return (
      <View className="w-full h-full">
        {isPdf ? (
          <Pdf
            trustAllCerts={false}
            source={{ uri: url, cache: true }}
            style={{ flex: 1, width: '100%', height: '100%' }}
            onLoadComplete={() => setIsLoading(false)}
            onError={(error: any) => {
              console.error('PDF Load Error:', error);
              setIsLoading(false);
              setIsError(true);
            }}
          />
        ) : (
          <Image
            source={{ uri: url }}
            style={{ width: '100%', height: '100%' }}
            contentFit="contain"
            onLoadEnd={() => setIsLoading(false)}
            onError={(error: any) => {
              console.error('Image Load Error:', error);
              setIsLoading(false);
              setIsError(true);
            }}
          />
        )}
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade" // Fade might feel smoother than slide
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/85 justify-center items-center p-4">
        <View className="w-full h-[85%] bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden relative">
          {isLoading && (
            <View className="absolute inset-0 justify-center items-center">
              <ActivityIndicator size="large" color={colors.blue[500]} />
            </View>
          )}
          {isError && (
             <View className="absolute inset-0 justify-center items-center p-4">
                <Ionicons name="warning-outline" size={40} color={colors.red[500]} />
                <Text className="mt-2 text-red-600 dark:text-red-400 text-center">
                  Could not load preview.
                </Text>
             </View>
          )}
          {!isLoading && !isError && renderContent()}

          {/* Close Button - Enhanced Style */}
          <TouchableOpacity
            className="absolute top-3 right-3 bg-black/40 p-2 rounded-full"
            onPress={onClose}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} // Easier to tap
          >
            <Ionicons name="close" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default DocumentPreviewModal;