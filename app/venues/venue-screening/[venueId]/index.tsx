import React, { useLayoutEffect } from 'react';
import { VenueDetail } from '../../../../features/venue-screening/components/VenueDetail';
import { useNavigation } from 'expo-router';

export default function VenueDetailScreen() {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Venue Detail',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
      headerStyle: {
        backgroundColor: '#003580',
      },
      headerTintColor: '#fff',
      headerTitleAlign: 'center',
    }); 
  })
  return <VenueDetail />;
}