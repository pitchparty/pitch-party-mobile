import React from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { SocialLinks } from '../types';

interface UserSocialLinksProps {
  socialLinks?: SocialLinks;
}

export default function UserSocialLinks({ socialLinks }: UserSocialLinksProps) {
  const socialPlatforms = [
    { name: 'twitter', icon: 'twitter', color: '#1DA1F2' },
    { name: 'linkedin', icon: 'linkedin', color: '#0077B5' },
    { name: 'github', icon: 'github', color: '#333' },
    { name: 'instagram', icon: 'instagram', color: '#E1306C' }
  ];

  const openSocialLink = (link?: string) => {
    if (link) Linking.openURL(link);
  };

  return (
    <View className="bg-white rounded-lg p-4">
      <Text className="text-lg font-semibold text-gray-700 mb-3">
        Social Links
      </Text>
      <View className="flex-row justify-around">
        {socialPlatforms.map(platform => (
          <TouchableOpacity
            key={platform.name}
            onPress={() => openSocialLink(socialLinks?.[platform.name as keyof SocialLinks])}
            className={`p-2 rounded-full ${
              socialLinks?.[platform.name as keyof SocialLinks] 
                ? 'bg-gray-100' 
                : 'bg-gray-200 opacity-50'
            }`}
          >
            <FontAwesome 
              name={platform.icon as any} 
              size={24} 
              color={platform.color} 
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}