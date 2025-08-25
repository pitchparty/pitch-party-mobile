import React, { useState } from "react";
import colors from "tailwindcss/colors";
import { Ionicons } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import { SafeAreaView, View, Text, TouchableOpacity } from "react-native";

import BookingListItem from "@/components/BookingListItem";
import { useUserBookings } from "@/features/bookings/hooks";
import { useAuthStore } from "@/features/authentication/store";
import SearchInput from "@/features/profiles/components/SearchInput";
import { BookingList } from "@/features/bookings/components/BookingList";
import { FilterChips } from "@/features/bookings/components/FilterChips";
import useIsomorphicLayoutEffect from "@/hooks/useIsomorphicLayoutEffect";

import {
  formatDateTime,
  getFullDateTime,
} from "@/features/bookings/utils/dateUtils";
import StatusStateView from "@/components/ui/StatusStateView";

const BookingsScreen = () => {
  const navigation = useNavigation();
  const user = useAuthStore((state) => state.user);
  const userId = user?.id as string;

  const { data, isPending, isError, error, refetch } = useUserBookings(userId);

  // State management
  const [isFilterVisible, setIsFilterVisible] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("upcoming");
  const [refreshing, setRefreshing] = useState(false);

  // Toggle filter visibility
  const toggleFilterVisibility = () => setIsFilterVisible(!isFilterVisible);

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  useIsomorphicLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={toggleFilterVisibility} className="mr-4">
          <Ionicons
            name={isFilterVisible ? "filter" : "filter-outline"}
            size={24}
            color={colors.white}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation, isFilterVisible]);

  // Filtering logic
  // Filter bookings based on status, search query, and date
  const filteredBookings = data
    ?.filter((booking) => {
      // Filter by status
      const matchesStatusFilter =
        selectedFilter === "all" || booking.status === selectedFilter;

      // Filter by search query (booking ID or user name)
      const matchesSearch =
        booking.booking_code
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        booking.away_team.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.home_team.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.venues.name.toLowerCase().includes(searchQuery.toLowerCase());

      // Combine event_date and event_time into a single Date object
      const bookingDateTime = getFullDateTime(
        booking.event_date,
        booking.event_time
      );

      // Get the current date and time
      const now = new Date();

      // Filter by date (considering both date and time)
      const isUpcoming = bookingDateTime > now;
      const matchesDateFilter =
        dateFilter === "all" ||
        (dateFilter === "upcoming" && isUpcoming) ||
        (dateFilter === "past" && !isUpcoming);

      // Filter by venue
      // const matchesVenue = !selectedVenue || booking.venue.id === selectedVenue.id;

      return matchesStatusFilter && matchesSearch && matchesDateFilter;
    })
    .sort((a, b) => {
      // Sort bookings by date and time
      const aDateTime = getFullDateTime(a.event_date, a.event_time);
      const bDateTime = getFullDateTime(b.event_date, b.event_time);
      return aDateTime.getTime() - bDateTime.getTime();
    });

  if (isPending)
    return <StatusStateView status="pending" message="Loading bookings..." />;
  if (isError)
    return (
      <StatusStateView
        status="error"
        message="Something went wrong"
        error={error}
      />
    );

  return (
    <SafeAreaView className="flex-1 bg-blue-50 dark:bg-gray-900 px-4">
      {/* Search Bar */}
      <SearchInput
        placeholder="Search by booking ID, team name, or venue name"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Filters */}
      {isFilterVisible && (
        <View className="mb-4">
          <Text className="text-gray-700 dark:text-gray-300 font-medium mb-2">
            Filter by Status
          </Text>
          <FilterChips
            filters={[
              { label: "All", value: "all" },
              { label: "Pending", value: "pending" },
              { label: "Confirmed", value: "confirmed" },
              { label: "Cancelled", value: "cancelled" },
            ]}
            selectedFilter={selectedFilter}
            onSelect={setSelectedFilter}
          />

          <Text className="text-gray-700 dark:text-gray-300 font-medium mt-4 mb-2">
            Filter by Date
          </Text>
          <FilterChips
            filters={[
              { label: "All", value: "all" },
              { label: "Upcoming", value: "upcoming" },
              { label: "Past", value: "past" },
            ]}
            selectedFilter={dateFilter}
            onSelect={setDateFilter}
          />
        </View>
      )}

      {/* Bookings List */}
      <BookingList
        data={filteredBookings || []}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        renderItem={({ item }) => {
          const formattedDate = formatDateTime(
            item.event_date,
            item.event_time,
            "MMM d, yyyy"
          );
          const formattedTime = formatDateTime(
            item.event_date,
            item.event_time,
            "h:mm a"
          );

          return (
            <BookingListItem
              item={{
                ...item,
                event_date: formattedDate,
                event_time: formattedTime,
              }}
              onPress={() => router.push(`/booking/${item.id}`)}
            />
          );
        }}
      />
    </SafeAreaView>
  );
};

export default BookingsScreen;
