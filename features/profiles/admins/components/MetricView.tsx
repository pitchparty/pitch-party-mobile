import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import MetricCard from './MetricCard'
import { useActiveBookings, useTotalVenues, useNewUsers, useTotalRevenue } from '../hooks';

const MetricView = () => {
    const { data: activeBookings, isLoading: isBookingsLoading } = useActiveBookings();
    const { data: totalVenues, isLoading: isVenuesLoading } = useTotalVenues();
    const { data: newUsers, isLoading: isNewUsersLoading } = useNewUsers();
    const { data: totalRevenue, isLoading: isRevenueLoading } = useTotalRevenue();
  return (
    <View className='flex-row flex-wrap justify-between'>
      <MetricCard
        title="Active Bookings"
        value={activeBookings || 0}
        period="Last 30 days"
        icon="calendar"
        color="bg-blue-500"
        isLoading={isBookingsLoading}   
      />
      <MetricCard
        title="Total Venues"
        value={totalVenues || 0}
        period="Last 7 days"
        icon="location"
        color="bg-green-500"
        isLoading={isVenuesLoading}
      />
      <MetricCard
        title="New Users"
        value={newUsers || 0}
        period="this week"
        icon="people"
        color="bg-purple-500"
        isLoading={isNewUsersLoading}
      />
      <MetricCard
        title="Revenue"
        value={totalRevenue || 0}
        period="today"
        icon="cash"
        color="bg-amber-500"
        isLoading={isRevenueLoading}
      />
    </View>
  )
}

export default MetricView

const styles = StyleSheet.create({})