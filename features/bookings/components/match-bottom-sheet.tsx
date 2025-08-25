import React from "react"
import { Image } from "expo-image"
import LottieView from "lottie-react-native"
import { MaterialIcons } from "@expo/vector-icons"
import { TouchableOpacity, View, Text } from "react-native"
import { BottomSheetScrollView } from "@gorhom/bottom-sheet"

import type { EplEvent } from "@/features/premierLeague/types/event"
import { useEventsDay } from "@/features/premierLeague/hooks/useEventsDay"

interface MatchBottomSheetProps {
  onSelect: (match: EplEvent) => void
}

export const MatchBottomSheet: React.FC<MatchBottomSheetProps> = ({ onSelect }) => {

  const { data, isPending, isError, error } = useEventsDay();

  const MatchItem = React.memo(
    ({
      match,
      onSelect,
    }: {
      match: EplEvent;
      onSelect: (venue: EplEvent) => void;
    }) => {
      const utcDateTime = new Date(`${match?.dateEvent}T${match?.strTime}Z`);

      // Format it in local time
      const localTime = utcDateTime.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
      
      const localDate = utcDateTime.toLocaleDateString([], {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      return (  <TouchableOpacity
      key={match.idEvent}
      onPress={() => onSelect(match)}
      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-3 mx-4 flex-row items-center justify-between shadow-sm"
    >
      <View className="flex-row items-center space-x-3">
        {/* Team Badges */}
        <View className="flex-row items-center -space-x-2">
          <Image
            source={{ uri: match.strHomeTeamBadge }}
            style={{ height: 32, width: 32 }}
            className="bg-gray-50 dark:bg-gray-800 rounded-full"
            contentFit="contain"
          />
          <Image
            source={{ uri: match.strAwayTeamBadge }}
            style={{ height: 32, width: 32 }}
            className="bg-gray-50 dark:bg-gray-800 rounded-full"
            contentFit="contain"
          />
        </View>

        {/* Match Details */}
        <View className="ml-2">
          <Text className="font-semibold text-gray-700 dark:text-gray-200">
            English Premier League
          </Text>
          <Text className="text-gray-600 dark:text-gray-400 text-sm mt-0.5">
            {match.strHomeTeam} vs {match.strAwayTeam}
          </Text>
          <Text className="text-gray-400 dark:text-gray-500 text-xs mt-0.5">
            {localDate} @ {localTime}
          </Text>
        </View>
      </View>

      {/* Chevron Icon */}
      <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
    </TouchableOpacity>    )}
  );

  return (
    <BottomSheetScrollView className="bg-blue-50 dark:bg-gray-800 pb-12">
      <View className="h-6" />
      {isPending && (
        <View className="items-center justify-center">
          <LottieView
            loop
            autoPlay
            source={require("../../../assets/animations/searching.json")}
            style={{
              width: 500,
              height: 100,
            }}
          />
          <Text className="text-center font-medium text-gray-700 dark:text-gray-200">
            Searching for matches...
          </Text>
        </View>
      )}
      {data?.length === 0 && (
        <View className="items-center justify-center">
        <LottieView
          autoPlay
          source={require("../../../assets/animations/empty-state.json")}
          style={{
            width: 500,
            height: 100,
          }}
        />
        <Text className="text-center font-medium text-gray-700 dark:text-gray-200">
          No Venues Found
        </Text>
      </View>
      )}
      {data?.map((match) => (
        <MatchItem key={match.idEvent} match={match} onSelect={onSelect} />
      ))}
      {isError && (
        <View className="items-center justify-center">
          <LottieView
            
            autoPlay
            source={require("../../../assets/animations/error-state.json")}
            style={{
              width: 500,
              height: 100,
            }}
          />
          <Text className="text-center font-medium text-gray-700 dark:text-gray-200">
            {error?.message}
          </Text>
        </View>
      )}
      <View className="h-6" />
    </BottomSheetScrollView>
  )
}
