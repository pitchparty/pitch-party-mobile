import React from 'react';
import { Image, StyleSheet, ImageStyle } from 'react-native';

type UserAvatarProps = {
  uri?: string;
  size?: number;
  className?: string; // Optional, for future flexibility if using something like Tailwind (with libraries like `twrnc`)
};

const UserAvatar: React.FC<UserAvatarProps> = ({ uri, size = 100 }) => {
  return (
    <Image
      source={{ uri }}
      style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}
      resizeMode="cover"
    />
  );
};

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: '#e1e1e1', // fallback background in case image fails
    marginRight: 12,
  },
});

export default UserAvatar;
