import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from '@/features/authentication/store'; // Adjust path
import useIsomorphicLayoutEffect from '@/hooks/useIsomorphicLayoutEffect'; // Adjust path
import { useVenueDetail, useVenueStatusUpdate } from '../hooks'; // Adjust path
import { Venue } from '../types'; // Adjust path

// Import Feature Components
import VenueHeader from './VenueHeader';
import VenueTabs from './VenueTabs';
import StatusChangeModal from './StatusChangeModal';
import LoadingIndicator from '@/components/ui/LoadingIndicator'; // Adjust path
import ErrorMessage from '@/components/ui/ErrorMessage'; // Adjust path

const VenueDetailScreen = () => {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const authUser = useAuthStore((state) => state.user); // Get the full auth user
  const userMetadata = authUser?.user_metadata; // Extract metadata

  // Fetch Venue Details
  const {
    data: venue,
    isPending,
    isError,
    error,
    refetch // Get refetch function from useQuery result
  } = useVenueDetail(id);

  // Status Update Mutation
  const updateVenueStatus = useVenueStatusUpdate();

  // State for Status Modal
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);

  // Hide header provided by the navigator
  useIsomorphicLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  // Handler for status change selection
  const handleStatusChange = (newStatus: Venue['status']) => {
    if (!venue?.id) return;
    updateVenueStatus.mutate(
      {
        id: venue.id,
        status: newStatus,
        is_active: newStatus === 'published', // Automatically activate when publishing
      },
      {
        onSuccess: () => {
           setIsStatusModalVisible(false);
           // Optionally refetch venue data or rely on query cache update
           // queryClient.invalidateQueries({ queryKey: ['venueDetail', id] });
        },
        onError: (err) => {
            console.error("Status update failed:", err);
            // Show an error message to the user (e.g., using a toast)
            setIsStatusModalVisible(false); // Close modal even on error
        }
      }
    );
  };

  // --- Render Logic ---

  if (isPending) {
    return <LoadingIndicator message="Loading venue details..." />;
  }

  if (isError || !venue) {
    return (
      <ErrorMessage
        message={!venue ? "Venue not found." : "Failed to load venue details."}
        error={error instanceof Error ? error : new Error('Unknown error')}
        onRetry={refetch} 
      />
    );
  }

  // Main component structure
  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-950">
      <StatusBar style="light" />

      <VenueHeader photos={venue.photos} />

      {/* Render Tabs below the header */}
      <VenueTabs
          venue={venue}
          userMetadata={userMetadata}
          onStatusChangePress={() => setIsStatusModalVisible(true)} // Pass callback to open modal
      />

      {/* Status Change Modal */}
      {userMetadata?.role !== 'user' && ( // Only render modal if user can change status
          <StatusChangeModal
            visible={isStatusModalVisible}
            currentStatus={venue.status || 'draft'}
            onClose={() => setIsStatusModalVisible(false)}
            onStatusSelect={handleStatusChange}
            isUpdating={updateVenueStatus.isPending}
          />
      )}
    </View>
  );
};

export default VenueDetailScreen;