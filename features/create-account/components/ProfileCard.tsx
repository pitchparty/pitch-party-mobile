import React from 'react';
import { View, Text, Image } from 'react-native';
import { Profile } from '../../auth/types';

interface ProfileCardProps {
  profile: Profile;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile }) => {
  return (
    <View className="bg-white rounded-xl p-4 shadow-sm">
      <View className="flex-row items-center">
        <Image
          source={
            profile.avatar_url
              ? { uri: profile.avatar_url }
              : require('../../../assets/images/blue_logo.png')
          }
          className="w-16 h-16 rounded-full bg-gray-200"
          style={{
            width: 40,
            height: 40,
          }}
          defaultSource={require('../../../assets/images/blue_logo.png')}
        />
        
        <View className="ml-4 flex-1">
          <Text className="text-xl font-semibold">{profile.full_name || 'User'}</Text>
          <Text className="text-gray-500">{profile.email}</Text>
          <View className="bg-blue-100 self-start px-2 py-0.5 rounded mt-1">
            <Text className="text-blue-800 text-xs capitalize">{profile.role}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ProfileCard;