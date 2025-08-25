import React from "react";
import { View } from "react-native";

import QuickStats from "@/components/QuickStats";
import SectionTitle from "@/components/SectionTitle";
import { useAuthStore } from "@/features/authentication/store";
import { useTodaysRevenue, useTotalVenues } from "@/features/venues/hooks";
import {
  usePendingBookings,
  useTodaysBookings,
} from "@/features/bookings/hooks";

const BasicStatistics = () => {
  const user = useAuthStore((state) => state.user);
  const userId = user?.id as string;

  const todaysRevenueQuery = useTodaysRevenue(userId);
  const totalVenuesQuery = useTotalVenues(userId);
  const todaysBookingsQuery = useTodaysBookings(totalVenuesQuery.data?.data?.[0]?.id as string);
  const pendingBookingsQuery = usePendingBookings(totalVenuesQuery.data?.data?.[0]?.id as string);

  return (
    <View className="mb-4 mt-4">
      <SectionTitle
        title="Quick Stats"
        description="See your venue's performance"
      />
      <View className="flex-row flex-wrap px-4 justify-between">
        <QuickStats
          title="Today's Bookings"
          value={todaysBookingsQuery.data?.count || 0}
          icon="calendar"
          color="#4CAF50"
          isLoading={todaysBookingsQuery.isPending}
          isError={todaysBookingsQuery.isError}
          onRefresh={todaysBookingsQuery.refetch}
        />
        <QuickStats
          title="Pending Actions"
          value={pendingBookingsQuery.data?.count || 0}
          icon="time"
          color="#FF9800"
          isLoading={pendingBookingsQuery.isPending}
          isError={pendingBookingsQuery.isError}
          onRefresh={pendingBookingsQuery.refetch}
        />

        <QuickStats
          title="--"
          value={`--`}
          icon="cash"
          color="#2196F3"
          isLoading={false}
          isError={false}
          onRefresh={() => {}}
        />

        <QuickStats
          title="Total Venues"
          value={totalVenuesQuery.data?.count || 0}
          icon="business"
          color="#9C27B0"
          isLoading={totalVenuesQuery.isPending}
          isError={totalVenuesQuery.isError}
          onRefresh={totalVenuesQuery.refetch}
        />
      </View>
    </View>
  );
};

export default BasicStatistics;
