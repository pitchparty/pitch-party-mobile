import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Image, TextInput, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { format, parseISO } from 'date-fns';
import { useVenueStreamStore } from '../store/venueStreamStore';
import { useSportEvents } from '../api/sportsApi';
import { SportEvent } from '../types';

export function AddGameScreen() {
  const { venueId } = useLocalSearchParams<{ venueId: string }>();
  const router = useRouter();
  const { availableSportEvents, fetchAvailableSportEvents, addStreamToVenue, isLoading } = useVenueStreamStore();
  const { data: sportEvents, isLoading: isLoadingEvents } = useSportEvents();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<SportEvent | null>(null);
  
  useEffect(() => {
    fetchAvailableSportEvents();
  }, [fetchAvailableSportEvents]);
  
  const eventsToDisplay = sportEvents || availableSportEvents;
  
  const filteredEvents = eventsToDisplay.filter(event => 
    event.strEvent.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (event.strLeague && event.strLeague.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (event.strHomeTeam && event.strHomeTeam.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (event.strAwayTeam && event.strAwayTeam.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const handleSelectEvent = (event: SportEvent) => {
    setSelectedEvent(event);
  };
  
  const handleConfirmEvent = async () => {
    if (selectedEvent && venueId) {
      await addStreamToVenue(venueId, selectedEvent);
      router.back();
    }
  };
  
  const renderEventCard = ({ item }: { item: SportEvent }) => {
    const isSelected = selectedEvent && selectedEvent.idEvent === item.idEvent;
    
    return (
      <Pressable 
        style={[styles.eventCard, isSelected && styles.selectedEventCard]} 
        onPress={() => handleSelectEvent(item)}
      >
        <View style={styles.eventCardContent}>
          <View style={styles.eventInfo}>
            <Text style={styles.leagueText}>{item.strLeague || 'Unknown League'}</Text>
            <Text style={styles.eventTitle}>{item.strEvent}</Text>
            
            <View style={styles.eventTimeContainer}>
              <Text style={styles.eventTime}>
                {format(parseISO(item.strTimestamp), 'MMM dd, yyyy • h:mm a')}
              </Text>
            </View>
            
            <View style={styles.teamsContainer}>
              <Text style={styles.teamName}>{item.strHomeTeam || 'TBA'}</Text>
              <Text style={styles.vsText}>vs</Text>
              <Text style={styles.teamName}>{item.strAwayTeam || 'TBA'}</Text>
            </View>
          </View>
          
          {item.strThumb ? (
            <Image 
              source={{ uri: item.strThumb }} 
              style={styles.eventImage} 
              resizeMode="cover"
            />
          ) : (
            <View style={styles.placeholderImage}>
              <Text style={styles.placeholderText}>No Image</Text>
            </View>
          )}
        </View>
        
        {isSelected && (
          <View style={styles.selectedIndicator}>
            <Text style={styles.selectedText}>Selected</Text>
          </View>
        )}
      </Pressable>
    );
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Add Game Screening</Text>
        <Text style={styles.headerSubtitle}>
          Select a game to screen at your venue
        </Text>
      </View>
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search games, teams or leagues..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      {isLoading || isLoadingEvents ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={styles.loaderText}>Loading available games...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredEvents}
          renderItem={renderEventCard}
          keyExtractor={item => item.idEvent}
          contentContainerStyle={styles.eventsList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No games found</Text>
              <Text style={styles.emptyStateSubtext}>
                Try adjusting your search or check back later for more games
              </Text>
            </View>
          }
        />
      )}
      
      {selectedEvent && (
        <View style={styles.confirmationContainer}>
          <Pressable 
            style={styles.confirmButton} 
            onPress={handleConfirmEvent}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.confirmButtonText}>
                Confirm Game Selection
              </Text>
            )}
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  header: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchInput: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loaderText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  eventsList: {
    padding: 16,
  },
  eventCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  selectedEventCard: {
    borderWidth: 2,
    borderColor: '#2196F3',
  },
  eventCardContent: {
    flexDirection: 'row',
    padding: 16,
  },
  eventInfo: {
    flex: 1,
  },
  leagueText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  eventTimeContainer: {
    marginBottom: 12,
  },
  eventTime: {
    fontSize: 14,
    color: '#666',
  },
  teamsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  teamName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    flex: 1,
  },
  vsText: {
    fontSize: 12,
    color: '#999',
    marginHorizontal: 8,
  },
  eventImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginLeft: 16,
  },
  placeholderImage: {
    width: 80,
    height: 80,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
  placeholderText: {
    fontSize: 12,
    color: '#999',
  },
  selectedIndicator: {
    backgroundColor: '#2196F3',
    padding: 8,
    alignItems: 'center',
  },
  selectedText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyState: {
    padding: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#999',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  confirmationContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});