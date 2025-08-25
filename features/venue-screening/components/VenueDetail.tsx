import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useVenueStreamStore } from '../store/venueStreamStore';
import { format } from 'date-fns';
import { VenueStream } from '../types';

export function VenueDetail() {
  const { venueId } = useLocalSearchParams<{ venueId: string }>();
  const router = useRouter();
  const { venues, venueStreams, fetchVenueStreams, isLoading } = useVenueStreamStore();
  
  useEffect(() => {
    if (venueId) {
      fetchVenueStreams(venueId);
    }
  }, [venueId, fetchVenueStreams]);
  
  const venue = venues.find(v => v.id === venueId);
  const streams = venueStreams[venueId] || [];
  
  const handleAddGame = () => {
    router.push(`/venues/venue-screening/${venueId}/add-game`);
  };
  
  const renderStreamCard = (stream: VenueStream) => (
    <View key={stream.id} style={styles.streamCard}>
      <View style={styles.streamHeader}>
        <Text style={styles.streamTitle}>{stream.eventName}</Text>
        <View style={[
          styles.statusBadge, 
          { backgroundColor: getStatusColor(stream.eventStatus) }
        ]}>
          <Text style={styles.statusText}>{stream.eventStatus}</Text>
        </View>
      </View>
      
      <View style={styles.streamDetails}>
        <View style={styles.teamMatch}>
          <Text style={styles.teamName}>{stream.homeTeam || 'TBA'}</Text>
          <Text style={styles.vsText}>vs</Text>
          <Text style={styles.teamName}>{stream.awayTeam || 'TBA'}</Text>
        </View>
        
        <View style={styles.streamInfo}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>League</Text>
            <Text style={styles.infoValue}>{stream.leagueName || 'N/A'}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Date</Text>
            <Text style={styles.infoValue}>{format(stream.streamDate, 'MMM dd, yyyy')}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Time</Text>
            <Text style={styles.infoValue}>{format(stream.streamDate, 'h:mm a')}</Text>
          </View>
        </View>
        
        <View style={styles.bookingInfo}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Bookings</Text>
            <Text style={styles.infoValue}>{stream.bookingsCount}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Status</Text>
            <Text style={styles.infoValue}>{stream.isActive ? 'Active' : 'Inactive'}</Text>
          </View>
        </View>
      </View>
    </View>
  );
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return '#2196F3';
      case 'in_progress': return '#FF9800';
      case 'finished': return '#4CAF50';
      default: return '#9E9E9E';
    }
  };
  
  if (!venue) {
    return (
      <View style={styles.loaderContainer}>
        <Text>Venue not found</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.venueHeader}>
          <Text style={styles.venueName}>{venue.name}</Text>
          <Text style={styles.venueAddress}>{venue.address}</Text>
          
          <View style={styles.venueStats}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Capacity</Text>
              <Text style={styles.statValue}>{venue.capacity || 'N/A'}</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Rating</Text>
              <Text style={styles.statValue}>{venue.averageRating?.toFixed(1) || 'N/A'}</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Status</Text>
              <View style={[
                styles.miniStatusBadge, 
                { backgroundColor: venue.isActive ? '#4CAF50' : '#FFC107' }
              ]}>
                <Text style={styles.miniStatusText}>
                  {venue.isActive ? 'Active' : 'Inactive'}
                </Text>
              </View>
            </View>
          </View>
        </View>
        
        <View style={styles.streamSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Game Screenings</Text>
            <Pressable style={styles.addButton} onPress={handleAddGame}>
              <Text style={styles.addButtonText}>+ Add Game</Text>
            </Pressable>
          </View>
          
          {isLoading ? (
            <View style={styles.loaderContainer}>
              <Text>Loading screenings...</Text>
            </View>
          ) : streams.length > 0 ? (
            <View>
              {streams.map(renderStreamCard)}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No game screenings yet</Text>
              <Text style={styles.emptyStateSubtext}>
                Add your first game screening to attract fans to your venue!
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  venueHeader: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  venueName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 4,
  },
  venueAddress: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  venueStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  miniStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  miniStatusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#fff',
  },
  streamSection: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  streamCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  streamHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  streamTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  streamDetails: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  teamMatch: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  teamName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  vsText: {
    fontSize: 14,
    color: '#999',
    marginHorizontal: 8,
  },
  streamInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  bookingInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoItem: {
    alignItems: 'center',
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
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
});