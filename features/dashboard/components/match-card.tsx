import React from "react";
import { Image } from "expo-image";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import { EplEvent } from "@/features/premierLeague/types/event";
import { useBookingStore } from "@/features/bookings/stores/useBookingStore";

interface Props {
  match: EplEvent | undefined;
}

const MatchCard: React.FC<Props> = ({ match }) => {
  const setSelectedMatch = useBookingStore((state) => state.setSelectedMatch);
  const isLoading = !match;

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

const getMatchStatus = (dateEvent?: string, strTime?: string): "Not Started" | "Live" | "Finished" => {
  const matchStart = new Date(`${dateEvent}T${strTime}Z`);
  const now = new Date();

  const matchEnd = new Date(matchStart.getTime() + 2 * 60 * 60 * 1000); // assume 2hr match duration

  if (now < matchStart) return "Not Started";
  if (now >= matchStart && now <= matchEnd) return "Live";
  return "Finished";
};

const status = getMatchStatus(match?.dateEvent, match?.strTime);


  const handlePress = () => {
    if (match) {
      setSelectedMatch(match);
      router.push("/booking");
    }
  };

  return (
    <TouchableOpacity
      className="bg-white dark:bg-gray-800 my-2 rounded-xl shadow-md overflow-hidden"
      style={styles.cardContainer}
      disabled={isLoading}
      activeOpacity={0.7}
      onPress={handlePress}
    >
      {!isLoading ? (
        <>
          {/* Top status bar */}
          <View className="flex-row justify-between items-center px-4 py-2 mb-4 bg-gray-200 dark:bg-gray-700">
            <Text className="text-xs font-medium text-gray-600 dark:text-gray-300">
              {localDate}
            </Text>
            <View className="flex-row items-center space-x-2">
              <View
                style={[
                  styles.statusDot,
                  status === "Not Started"
                    ? styles.statusUpcoming
                    : status === "Live"
                    ? styles.statusLive
                    : styles.statusFinished,
                ]}
              />
              <Text className="text-xs ml-1 font-semibold text-gray-600 dark:text-gray-300">
                {localTime}
              </Text>
            </View>
          </View>

          {/* Main content */}
          <View className="px-4 pt-3 pb-4">
            <View className="flex-row items-center">
              {/* Home team */}
              <View className="flex-1 items-center">
                <Image
                  source={{ uri: match?.strHomeTeamBadge }}
                  style={styles.logo}
                  contentFit="contain"
                  transition={200}
                />
                <Text
                  className="mt-2 text-center font-bold text-gray-800 dark:text-white"
                  numberOfLines={1}
                >
                  {match?.strHomeTeam}
                </Text>
              </View>

              {/* VS section */}
              <View className="w-16 items-center justify-center">
                <Text className="text-base font-semibold text-gray-400 dark:text-gray-500">
                  VS
                </Text>
              </View>

              {/* Away team */}
              <View className="flex-1 items-center">
                <Image
                  source={{ uri: match?.strAwayTeamBadge }}
                  style={styles.logo}
                  contentFit="contain"
                  transition={200}
                />
                <Text
                  className="mt-2 text-center font-bold text-gray-800 dark:text-white"
                  numberOfLines={1}
                >
                  {match?.strAwayTeam}
                </Text>
              </View>
            </View>
          </View>
        </>
      ) : (
        // Loading state
        <View style={styles.loadingContainer}>
          <ShimmerPlaceholder
            LinearGradient={LinearGradient}
            style={styles.shimmerHeader}
          />
          <View style={styles.shimmerContent}>
            <ShimmerPlaceholder
              LinearGradient={LinearGradient}
              style={styles.shimmerLogo}
            />
            <ShimmerPlaceholder
              LinearGradient={LinearGradient}
              style={styles.shimmerVS}
            />
            <ShimmerPlaceholder
              LinearGradient={LinearGradient}
              style={styles.shimmerLogo}
            />
          </View>
          <ShimmerPlaceholder
            LinearGradient={LinearGradient}
            style={styles.shimmerFooter}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    elevation: 2,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusUpcoming: {
    backgroundColor: "#FACC15", // Yellow
  },
  statusLive: {
    backgroundColor: "#EF4444", // Red
  },
  statusFinished: {
    backgroundColor: "#10B981", // Green
  },
  loadingContainer: {
    padding: 16,
    height: 160,
    justifyContent: "space-between",
  },
  shimmerHeader: {
    height: 20,
    borderRadius: 4,
    marginBottom: 16,
  },
  shimmerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  shimmerLogo: {
    width: 64,
    height: 64,
    borderRadius: 8,
  },
  shimmerVS: {
    width: 30,
    height: 20,
    borderRadius: 4,
  },
  shimmerFooter: {
    height: 16,
    width: "50%",
    alignSelf: "center",
    borderRadius: 4,
  },
});

export default MatchCard;
