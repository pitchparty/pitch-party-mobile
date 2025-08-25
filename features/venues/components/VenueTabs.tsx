import React from 'react';
import { useColorScheme } from 'nativewind';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import colors from 'tailwindcss/colors'; // Assuming direct color usage
import { Venue,  VenueDocument } from '../types'; // Import all needed types

// Import Tab Screen Components
import VenueDetailsTab from './VenueDetailsTab';
import VenueDocumentsTab from './VenueDocumentsTab';
import VenuePhotosTab from './VenuePhotosTab';
import { UserMetadata } from '@supabase/supabase-js';

const Tab = createMaterialTopTabNavigator();

interface VenueTabsProps {
  venue: Venue;
  userMetadata: UserMetadata | undefined;
  onStatusChangePress: () => void; // Callback for status change button
}

const VenueTabs: React.FC<VenueTabsProps> = ({ venue, userMetadata, onStatusChangePress }) => {
  const { colorScheme } = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  // Only show Documents and Photos tabs to admin/manager
  const canViewSensitiveTabs = userMetadata?.role === 'admin' || userMetadata?.role === 'manager';

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.blue[600], // Use specific color values
        tabBarInactiveTintColor: isDarkMode ? colors.gray[400] : colors.gray[500],
        tabBarIndicatorStyle: { backgroundColor: colors.blue[600], height: 3 },
        tabBarStyle: {
          backgroundColor: isDarkMode ? colors.gray[900] : colors.white, // Contrasting background
          elevation: 1, // Minimal elevation
          shadowOpacity: 0.05, // Subtle shadow for iOS
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: 'bold', // Bolder labels
          textTransform: 'none', // No uppercase
        },
        lazy: true, // Render tabs only when navigated to
      }}
    >
      <Tab.Screen name="Details">
        {() => (
           <VenueDetailsTab
              venue={venue}
              userMetadata={userMetadata}
              onStatusChangePress={onStatusChangePress}
           />
        )}
      </Tab.Screen>

      {canViewSensitiveTabs && (
          <Tab.Screen name="Photos">
            {() => <VenuePhotosTab photos={venue.photos} />}
          </Tab.Screen>
      )}

      {canViewSensitiveTabs && (
          <Tab.Screen name="Documents">
              {() => <VenueDocumentsTab venueId={venue.id as string} />}
          </Tab.Screen>
      )}
    </Tab.Navigator>
  );
};

export default VenueTabs;