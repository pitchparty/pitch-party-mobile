import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import MatchCard from "@/features/dashboard/components/match-card";
import { useNavigation } from "expo-router";
import useIsomorphicLayoutEffect from "@/hooks/useIsomorphicLayoutEffect";
import { useEventsDay } from "@/features/premierLeague/hooks/useEventsDay";
import LottieView from "lottie-react-native";
import StatusStateView from "@/components/ui/StatusStateView";

const UpcomingMatches = () => {
  const navigation = useNavigation();

  useIsomorphicLayoutEffect(() => {
    navigation.setOptions({
      title: "Upcoming Matches",
    });
  }, [navigation]);

  const { data, isPending, isError, error } = useEventsDay();

 
  if (isPending)
    return <StatusStateView status="pending" message="Loading matches..." />;
  if (isError)
    return (
      <StatusStateView
        status="error"
        message="Something went wrong"
        error={error}
      />
    );

  return (
    <FlatList
      className="bg-blue-50 dark:bg-gray-900"
      data={data}
      renderItem={({ item }) => <MatchCard key={item.idEvent} match={item} />}
      showsVerticalScrollIndicator={false}
      keyExtractor={(item) => item.idEvent}
      contentContainerStyle={{
        paddingBottom: 20,
        paddingTop: 10,
        paddingHorizontal: 10,
      }}
      ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
      ListEmptyComponent={
        <StatusStateView
          status="empty"
          message="No matches available"
          description="There are no matches to display at the moment. Please check back later."
        />
      }
    />
  );
};

export default UpcomingMatches;