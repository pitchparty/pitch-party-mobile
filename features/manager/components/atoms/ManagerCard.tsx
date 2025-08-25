import React from 'react';
import { View, Text } from 'react-native';
import AnimatedContainer from './AnimatedContainer';

interface ManagerCardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  animationDelay?: number;
}


const ManagerCard: React.FC<ManagerCardProps> = ({
  children,
  title,
  className = '',
  animationDelay = 0,
}) => {
  return (
    <AnimatedContainer delay={animationDelay} className="w-80">
      <View className={`bg-white rounded-xl p-5 shadow-sm ${className}`}>
        {title && (
          <Text className="text-lg font-semibold mb-4">{title}</Text>
        )}
        {children}
      </View>
    </AnimatedContainer>
  );
};

export default ManagerCard;
