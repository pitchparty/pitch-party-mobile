// File: components/VenueDashboardStats.tsx
import React from 'react';
import { View } from 'react-native';
import QuickStats from '@/components/QuickStats';
import { useAuthStore } from '@/features/authentication/store';
import { useVenueStats } from '../hooks/queries/useVenueStats';

interface VenueDashboardStatsProps {
  managerId?: string;
  useJunctionTable?: boolean;
}

const VenueDashboardStats: React.FC<VenueDashboardStatsProps> = ({ 
  managerId: propManagerId,
  useJunctionTable = false
}) => {
  // Get the current user if managerId is not provided
  const { user } = useAuthStore();
  const managerId = propManagerId || user?.id;
  
  const { 
    data: stats,
    isLoading,
    isError,
    refetch
  } = useVenueStats(managerId, useJunctionTable);

  // Format average rating to display with star
  const formattedRating = stats?.averageRating 
    ? `${stats.averageRating.toFixed(1)}★` 
    : 'N/A';

  return (
    <View className="flex-row flex-wrap justify-between px-4">
      {/* Total Venues */}
      <QuickStats
        title="Total Venues"
        value={stats?.totalVenues || 0}
        icon="business"
        color="#4F46E5" // Indigo
        isLoading={isLoading}
        isError={isError}
        onRefresh={() => refetch()}
      />
      
      {/* Active Venues */}
      <QuickStats
        title="Active Venues"
        value={stats?.activeVenues || 0}
        icon="checkmark-circle"
        color="#10B981" // Green
        isLoading={isLoading}
        isError={isError}
        onRefresh={() => refetch()}
      />
      
      {/* Average Rating */}
      <QuickStats
        title="Average Rating"
        value={formattedRating}
        icon="star"
        color="#F59E0B" // Amber
        isLoading={isLoading}
        isError={isError}
        onRefresh={() => refetch()}
      />
      
      {/* Pending Approval */}
      <QuickStats
        title="Pending Approval"
        value={stats?.pendingApproval || 0}
        icon="hourglass"
        color="#EF4444" // Red
        isLoading={isLoading}
        isError={isError}
        onRefresh={() => refetch()}
      />
    </View>
  );
};

// Alternative statistics set that can be used instead
export const VenueDashboardStatsAlt: React.FC<VenueDashboardStatsProps> = ({ 
  managerId: propManagerId,
  useJunctionTable = false
}) => {
  // Get the current user if managerId is not provided
  const { user } = useAuthStore();
  const managerId = propManagerId || user?.id;
  
  const { 
    data: stats,
    isLoading,
    isError,
    refetch
  } = useVenueStats(managerId, useJunctionTable);

  return (
    <View className="flex-row flex-wrap justify-between">
      {/* Published vs Draft */}
      <QuickStats
        title="Published Venues"
        value={stats?.publishedVenues || 0}
        icon="globe"
        color="#3B82F6" // Blue
        isLoading={isLoading}
        isError={isError}
        onRefresh={() => refetch()}
      />
      
      {/* Draft Venues */}
      <QuickStats
        title="Draft Venues"
        value={stats?.draftVenues || 0}
        icon="document-text"
        color="#8B5CF6" // Purple
        isLoading={isLoading}
        isError={isError}
        onRefresh={() => refetch()}
      />
      
      {/* Total Photos */}
      <QuickStats
        title="Total Photos"
        value={stats?.totalPhotos || 0}
        icon="images"
        color="#EC4899" // Pink
        isLoading={isLoading}
        isError={isError}
        onRefresh={() => refetch()}
      />
      
      {/* Archived Venues */}
      <QuickStats
        title="Archived Venues"
        value={stats?.archivedVenues || 0}
        icon="archive"
        color="#6B7280" // Gray
        isLoading={isLoading}
        isError={isError}
        onRefresh={() => refetch()}
      />
    </View>
  );
};

export default VenueDashboardStats;