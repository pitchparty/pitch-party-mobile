import { StyleSheet, Text, View, Image, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native'
import React, { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { format } from 'date-fns';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useVenueByManager, useVenueDetail } from '@/features/venues/hooks';
import { useAuthStore } from '@/features/authentication/store';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { EplEvent } from '@/features/premierLeague/types/event';
import { MatchBottomSheet } from '@/features/bookings/components/match-bottom-sheet';

export interface Game {
    idEvent: string;
    strEvent: string;
    strLeague: string;
    strSport: string;
    strHomeTeam: string;
    strAwayTeam: string;
    strThumb?: string;
    dateEvent: string;
    strTime: string;
  }

export interface GameScreening {
    id: string;
    gameId: string;
    gameDetails: Game;
    venueId: string;
    screeningTime: string;
    ticketPrice?: number;
  }

const VenueDetail = () => {
    const { screening } = useLocalSearchParams<{ screening: string }>();

    const navigation = useNavigation();

    useLayoutEffect(() => {
      navigation.setOptions({
          title: 'Venue Detail',
          headerTitleAlign: 'center',
          headerTitleStyle: {
              fontSize: 20,
              fontWeight: 'bold',
              color: 'white',
          },
          headerStyle: {
              backgroundColor: '#007AFF',
              height: 110,
          }
      })
  }, [navigation]);

    const { data, isPending, isError} = useVenueDetail(screening);

    const matchBottomSheetRef = useRef<BottomSheetModal>(null);

    const [addGame, setAddGame] = useState<EplEvent | null>(null);

    const snapPoints = useMemo(() => ["25%", "50%", "90%"], []);

    const handleMatchSelection = useCallback(
      () => matchBottomSheetRef.current?.present(),
      []
    );

    const handleMatchSelect = useCallback(
      (match: EplEvent) => {
        console.log('Match selected:', match);
        setAddGame(match);
        matchBottomSheetRef.current?.dismiss();
      },
      [setAddGame]
    );


    const screeningGames = [{
        id: '1',
        name: 'Sports Hub Arena',
        address: '123 Main Street, Downtown, Metro City',
        capacity: 500,
        screeningGames: [
          {
            id: '101',
            gameId: '1001',
            gameDetails:  {
                idEvent: '1007',
                strEvent: 'Novak Djokovic vs Rafael Nadal',
                strLeague: 'French Open',
                strSport: 'Tennis',
                strHomeTeam: 'Novak Djokovic',
                strAwayTeam: 'Rafael Nadal',
                strThumb: 'https://www.thesportsdb.com/images/media/event/thumb/ypw3kh1654959916.jpg',
                dateEvent: '2025-05-26',
                strTime: '14:00:00',
              },
            venueId: '1',
            screeningTime: '2025-05-18 15:30:00',
            ticketPrice: 25.99,
          },
          {
            id: '102',
            gameId: '1004',
            gameDetails:  {
                idEvent: '1008',
                strEvent: 'UFC 302: Jones vs Miocic',
                strLeague: 'UFC',
                strSport: 'MMA',
                strHomeTeam: 'Jon Jones',
                strAwayTeam: 'Stipe Miocic',
                strThumb: 'https://www.thesportsdb.com/images/media/event/thumb/vhyp8r1648925870.jpg',
                dateEvent: '2025-05-24',
                strTime: '22:00:00',
              },
            venueId: '1',
            screeningTime: '2025-05-22 21:00:00',
            ticketPrice: 32.50,
          }
        ],
      }];

    if (isPending) {
        return (
          <View className="flex-1 items-center justify-center bg-white">
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        );
      }
    
      const renderScreeningGame = ({ item }: { item: GameScreening }) => (
        <View className="bg-gray-100 p-4 mb-4 rounded-lg">
          <View className="flex-row">
            {item.gameDetails.strThumb && (
              <Image 
                source={{ uri: item.gameDetails.strThumb }} 
                className="w-20 h-20 rounded mr-3" 
              />
            )}
            <View className="flex-1">
              <Text className="text-lg font-bold">{item.gameDetails.strEvent}</Text>
              <Text className="text-gray-600">{item.gameDetails.strLeague}</Text>
              <Text className="mt-1">
                {format(new Date(item.gameDetails.dateEvent), 'MMM d, yyyy')} at {item.gameDetails.strTime}
              </Text>
              <Text className="font-semibold mt-2">Screening: {item.screeningTime}</Text>
              {item.ticketPrice && (
                <Text className="font-semibold">Ticket Price: ${item.ticketPrice.toFixed(2)}</Text>
              )}
            </View>
          </View>
          <TouchableOpacity 
            className="bg-red-500 py-2 px-4 rounded mt-2 self-end"
            onPress={() => {}}
          >
            <Text className="text-white font-medium">Remove</Text>
          </TouchableOpacity>
        </View>
      );

  return (
    <View className="flex-1 bg-white p-4">
      <View className="bg-blue-50 p-4 rounded-lg mb-4">
        <Text className="text-2xl font-bold">{data?.name}</Text>
        <Text className="text-gray-600 mt-1">{data?.address}</Text>
        <Text className="mt-1">Capacity: {data?.capacity}</Text>
      </View>

      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-xl font-semibold">Current Screenings</Text>
        <TouchableOpacity 
          className="bg-blue-500 py-2 px-4 rounded"
          onPress={handleMatchSelection}
        >
          <Text className="text-white font-medium">Add Game</Text>
        </TouchableOpacity>
      </View>

      {screeningGames.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500 text-lg">No games scheduled for screening</Text>
        </View>
      ) : (
        <FlatList
          data={screeningGames[0].screeningGames}
          keyExtractor={(item) => item.id}
          renderItem={renderScreeningGame}
          showsVerticalScrollIndicator={false}
        />
      )}
            <BottomSheetModal
        ref={matchBottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        enablePanDownToClose
      >
        <MatchBottomSheet onSelect={handleMatchSelect} />
      </BottomSheetModal>
    </View>
  )
}

export default VenueDetail;