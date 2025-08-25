import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router'; // Use expo-router for navigation
import { LinearGradient } from 'expo-linear-gradient'; // For subtle gradient

const PLACEHOLDER_IMAGE = 'https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg';

interface VenueHeaderProps {
  photos: string[] | undefined | null;
}

const VenueHeader: React.FC<VenueHeaderProps> = ({ photos }) => {
  const headerImageUrl = photos?.[0] || PLACEHOLDER_IMAGE;

  return (
    <View className="relative">
      <Image
        source={{ uri: headerImageUrl }}
        style={{ width: '100%', height: 260 }} // Slightly taller header
        contentFit="cover"
      />
      {/* Subtle gradient overlay for better button visibility */}
      <LinearGradient
           colors={['rgba(0,0,0,0.6)', 'transparent']}
           style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 100 }}
       />
      {/* Back Button - Improved Style */}
      <TouchableOpacity
        className="absolute top-14 left-4 bg-black/40 p-2.5 rounded-full shadow-lg" // More padding, stronger shadow
        onPress={() => router.back()}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="arrow-back" size={24} color="#ffffff" />
      </TouchableOpacity>

      {/* Edit Button Placeholder (optional) */}
   <TouchableOpacity
        className="absolute top-14 right-4 bg-black/40 p-2.5 rounded-full shadow-lg"
        onPress={() => {}}
      >
        <Ionicons name="create-outline" size={24} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );
};

export default VenueHeader;