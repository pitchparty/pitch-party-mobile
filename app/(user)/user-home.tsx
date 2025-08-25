import React from "react";
import { View, ScrollView, Touchable, TouchableOpacity, Text } from "react-native";
import { router, useNavigation } from "expo-router";
import useIsomorphicLayoutEffect from "@/hooks/useIsomorphicLayoutEffect";

import SectionHeader from "@/components/ui/SectionHeader";
import StatusStateView from "@/components/ui/StatusStateView";
import VenueItem from "@/features/venues/components/VenueItem";
import NotificationBell from "@/components/ui/NotificationBell";
import MatchCard from "@/features/dashboard/components/match-card";
import LeagueDetails from "@/features/dashboard/components/league-details";

import { useActiveVenues } from "@/features/venues/hooks";
import { useEventsDay } from "@/features/premierLeague/hooks/useEventsDay";

const HomeScreen = () => {
  const navigation = useNavigation();

  useIsomorphicLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: "PitchParty",
      headerRight: () => <NotificationBell count={0} />,
    });
  }, [navigation]);

  const {
    data: events,
    isPending: eventsPending,
  } = useEventsDay();

  const {
    data: venues,
    isPending: venuesPending,
    isError: venuesError,
  } = useActiveVenues();


  return (
    <ScrollView
      className="flex-1 p-4 bg-blue-50 dark:bg-gray-900"
      contentContainerStyle={{ marginBottom: 200 }}
    >
      <LeagueDetails />
      <SectionHeader
        title="Upcoming Matches"
        description="Don't miss the biggest games happening this week."
        onPressViewAll={() => router.push("/upcoming-matches")}
      />
      <MatchCard match={eventsPending ? undefined : events?.[0]} />
      <SectionHeader
        title="Popular Venues"
        description="Find the perfect place for your next event"
        onPressViewAll={
          venues?.length === 0 ? undefined : () => router.push("/view-venues")
        }
      />
      {venues?.length === 0 || undefined || venuesError ? (
        <StatusStateView
          status="empty"
          message="No venues available"
          description="There are no venues to display at the moment. Please check back later."
        />
      ) : (
        <VenueItem
          key={venues?.[0].id}
          venue={venues?.[0]}
          isLoading={venuesPending}
        />
      )}
      <View className="h-20" />
    </ScrollView>
  );
};

export default HomeScreen;
