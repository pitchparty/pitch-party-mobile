// src/components/PendingBookingsSection.tsx
import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { colorScheme } from "nativewind";
import colors from "tailwindcss/colors";
import SectionTitle from "@/components/SectionTitle";
import SwipeableListItem from "@/components/SwipeableListItem";
import BookingListItem from "@/components/BookingListItem";
import EmptyState from "@/components/EmptyState";
import { BookingItem } from "@/features/bookings/types";
import { router } from "expo-router";
import { UseQueryResult } from "@tanstack/react-query";

interface PendingBookingsSectionProps {
  pendingBookingsQuery: UseQueryResult<BookingItem[], Error>
}

export const PendingBookingsSection: React.FC<PendingBookingsSectionProps> = ({
  pendingBookingsQuery,
}) => {

  console.log("PendingBookingsSection: pendingBookingsQuery", pendingBookingsQuery);
  const renderContent = () => {
    if (pendingBookingsQuery.isPending) {
      return (
        <ActivityIndicator
          color={
            colorScheme.get() === "dark" ? colors.gray[500] : colors.gray[100]
          }
        />
      );
    }

    if (pendingBookingsQuery.isError) {
      return (
        <Text style={{ color: colors.red[500] }}>Failed to load bookings.</Text>
      );
    }

    const bookings = pendingBookingsQuery.data?.data;

    if (bookings?.length === 0) {
      return <EmptyState type="bookings" />;
    }

    return bookings.map((booking: BookingItem) => (
      <BookingListItem
      key={booking.id}
        item={booking}
        onPress={() => router.push(`/booking/${booking.id}`)}
      />
    ));
  };

  return (
    <View className="mb-6">
      <SectionTitle
        title="Pending Bookings"
        description="Swipe left to confirm or reject"
      />
      <View className="p-4">{renderContent()}</View>
    </View>
  );
};
