// src/components/CurrentGameSection.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { EplEvent } from '../types/event';

interface CurrentGameSectionProps {
  currentGame?: EplEvent;
  onUpdatePress: () => void;
}

export const CurrentGameSection: React.FC<CurrentGameSectionProps> = ({ 
  currentGame, 
  onUpdatePress 
}) => {
  if (!currentGame) return null;

  return (
    <View className="m-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
      <View className="flex-row justify-between items-center">
        <View>
          <Text className="text-lg font-bold">
            {currentGame.strHomeTeam} vs {currentGame.strAwayTeam}
          </Text>
          <Text className="text-gray-500">
            Starting: {currentGame.dateEvent} @ {currentGame.strTime}
          </Text>
        </View>
        <TouchableOpacity
          className="dark:bg-gray-700 border border-blue-100 px-4 py-2 rounded-lg"
          onPress={onUpdatePress}
        >
          <Text className="text-indigo-800 dark:text-white font-medium">Update</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};