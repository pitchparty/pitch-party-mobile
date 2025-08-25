
import { useNavigation } from 'expo-router';
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, Image, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Game type definition
interface Game {
  idEvent: string;
  strEvent: string;
  strThumb: string | null;
  dateEvent: string;
  strTime: string;
}

// Custom hook for managing now playing games
const useNowPlaying = () => {
  const [nowPlaying, setNowPlaying] = useState<Game[]>([]);
  const [featuredGame, setFeaturedGame] = useState<Game | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved games from AsyncStorage
  const loadSavedGames = useCallback(async () => {
    try {
      const savedNowPlaying = await AsyncStorage.getItem('nowPlayingGames');
      const savedFeaturedGame = await AsyncStorage.getItem('featuredGame');
      
      if (savedNowPlaying) {
        setNowPlaying(JSON.parse(savedNowPlaying));
      }
      
      if (savedFeaturedGame) {
        setFeaturedGame(JSON.parse(savedFeaturedGame));
      }
    } catch (error) {
      console.error('Error loading saved games:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save games to AsyncStorage
  const saveGames = useCallback(async (games: Game[], featured: Game | null) => {
    try {
      await AsyncStorage.setItem('nowPlayingGames', JSON.stringify(games));
      await AsyncStorage.setItem('featuredGame', JSON.stringify(featured));
    } catch (error) {
      console.error('Error saving games:', error);
    }
  }, []);

  // Add a game to now playing
  const addGame = useCallback((game: Game) => {
    setNowPlaying(prev => {
      // Check if game already exists
      if (prev.some(g => g.idEvent === game.idEvent)) {
        return prev;
      }
      const newGames = [...prev, game];
      saveGames(newGames, featuredGame);
      return newGames;
    });
  }, [featuredGame, saveGames]);

  // Remove a game from now playing
  const removeGame = useCallback((gameId: string) => {
    setNowPlaying(prev => {
      const newGames = prev.filter(game => game.idEvent !== gameId);
      saveGames(newGames, featuredGame?.idEvent === gameId ? null : featuredGame);
      return newGames;
    });
    
    // If the removed game was featured, remove it from featured as well
    if (featuredGame?.idEvent === gameId) {
      setFeaturedGame(null);
    }
  }, [featuredGame, saveGames]);

  // Set a game as featured
  const setAsFeatured = useCallback((game: Game) => {
    setFeaturedGame(game);
    
    // Ensure the featured game is also in now playing
    setNowPlaying(prev => {
      if (!prev.some(g => g.idEvent === game.idEvent)) {
        const newGames = [...prev, game];
        saveGames(newGames, game);
        return newGames;
      }
      saveGames(prev, game);
      return prev;
    });
  }, [saveGames]);

  // Initialize by loading saved games
  useEffect(() => {
    loadSavedGames();
  }, [loadSavedGames]);

  return {
    nowPlaying,
    featuredGame,
    isLoading,
    addGame,
    removeGame,
    setAsFeatured,
    loadSavedGames
  };
};

// Game Card Component
const GameCard = ({ 
  game, 
  isFeatured, 
  onRemove, 
  onSetFeatured 
}: { 
  game: Game; 
  isFeatured: boolean; 
  onRemove: (id: string) => void; 
  onSetFeatured: (game: Game) => void; 
}) => {
  return (
    <TouchableOpacity 
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md m-2 overflow-hidden w-64"
      onPress={() => onSetFeatured(game)}
    >
      <View className="relative">
        <Image 
          source={{ uri: game.strThumb || 'https://via.placeholder.com/300x150?text=No+Image' }} 
          className="w-full h-32" 
          resizeMode="cover"
        />
        
        {isFeatured && (
          <View className="absolute top-2 left-2 bg-blue-600 px-2 py-1 rounded-md">
            <Text className="text-white text-xs font-bold">Featured</Text>
          </View>
        )}
        
        <TouchableOpacity 
          className="absolute top-2 right-2 bg-red-500 p-1 rounded-full"
          onPress={() => onRemove(game.idEvent)}
        >
          <Ionicons name="trash-outline" size={16} color="white" />
        </TouchableOpacity>
      </View>
      
      <View className="p-3">
        <Text className="text-gray-800 dark:text-gray-200 font-bold text-sm" numberOfLines={2}>
          {game.strEvent}
        </Text>
        <Text className="text-gray-600 dark:text-gray-400 text-xs mt-1">
          {game.dateEvent} • {game.strTime}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

// Featured Game Component
const FeaturedGame = ({ 
  game, 
  onRemove, 
  onSetFeatured 
}: { 
  game: Game; 
  onRemove: (id: string) => void; 
  onSetFeatured: (game: Game) => void; 
}) => {
  return (
    <View className="bg-white dark:bg-gray-800 rounded-xl shadow-md m-4 overflow-hidden">
      <View className="relative">
        <Image 
          source={{ uri: game.strThumb || 'https://via.placeholder.com/600x300?text=No+Image' }} 
          className="w-full h-48" 
          resizeMode="cover"
        />
        
        <View className="absolute top-3 left-3 bg-blue-600 px-3 py-1 rounded-md">
          <Text className="text-white font-bold">Featured Game</Text>
        </View>
        
        <TouchableOpacity 
          className="absolute top-3 right-3 bg-red-500 p-2 rounded-full"
          onPress={() => onRemove(game.idEvent)}
        >
          <Ionicons name="trash-outline" size={18} color="white" />
        </TouchableOpacity>
      </View>
      
      <View className="p-4">
        <Text className="text-gray-800 dark:text-gray-200 font-bold text-lg">
          {game.strEvent}
        </Text>
        <Text className="text-gray-600 dark:text-gray-400 mt-1">
          {game.dateEvent} • {game.strTime}
        </Text>
      </View>
    </View>
  );
};

// Empty State Component
const EmptyState = ({ 
  message, 
  icon 
}: { 
  message: string; 
  icon: string; 
}) => {
  return (
    <View className="flex-1 justify-center items-center p-6">
      <Ionicons name={icon} size={48} color="#9CA3AF" />
      <Text className="text-gray-500 dark:text-gray-400 text-center mt-4 text-lg">
        {message}
      </Text>
    </View>
  );
};

const ManagerHome = () => {
  const navigation = useNavigation();
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const {
    nowPlaying,
    featuredGame,
    isLoading: isLoadingSaved,
    addGame,
    removeGame,
    setAsFeatured,
    loadSavedGames
  } = useNowPlaying();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  // Fetch games from TheSportsDB API
  const fetchGames = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch('https://www.thesportsdb.com/api/v1/json/3/eventsday.php?d=2023-05-15');
      const data = await response.json();
      
      if (data.events && Array.isArray(data.events)) {
        setGames(data.events);
      } else {
        setGames([]);
        setError('No events found');
      }
    } catch (error) {
      console.error('Error fetching games:', error);
      setError('Failed to fetch games. Please try again.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchGames();
    loadSavedGames();
  }, [fetchGames, loadSavedGames]);

  // Initial data fetch
  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  // Render loading state
  if (isLoading || isLoadingSaved) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100 dark:bg-gray-900">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text className="text-gray-600 dark:text-gray-400 mt-4">
            Loading games...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100 dark:bg-gray-900">
      <View className="px-4 py-4 border-b border-gray-200 dark:border-gray-800">
        <Text className="text-2xl font-bold text-gray-800 dark:text-white">
          Venue Dashboard
        </Text>
        <Text className="text-gray-600 dark:text-gray-400">
          Manage your featured and now playing games
        </Text>
      </View>

      <FlatList
        data={games}
        keyExtractor={(item) => item.idEvent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={['#4F46E5']}
          />
        }
        ListHeaderComponent={
          <>
            {/* Featured Game Section */}
            <View className="mt-4">
              <Text className="text-lg font-semibold text-gray-800 dark:text-white px-4 mb-2">
                Featured Game
              </Text>
              
              {featuredGame ? (
                <FeaturedGame 
                  game={featuredGame} 
                  onRemove={removeGame} 
                  onSetFeatured={setAsFeatured} 
                />
              ) : (
                <View className="bg-white dark:bg-gray-800 rounded-xl shadow-md m-4 p-6 items-center">
                  <Ionicons name="star-outline" size={48} color="#9CA3AF" />
                  <Text className="text-gray-500 dark:text-gray-400 text-center mt-4">
                    No featured game selected. Tap on any game below to feature it.
                  </Text>
                </View>
              )}
            </View>

            {/* Now Playing Section */}
            <View className="mt-4">
              <Text className="text-lg font-semibold text-gray-800 dark:text-white px-4 mb-2">
                Now Playing Games
              </Text>
              
              {nowPlaying.length > 0 ? (
                <FlatList
                  data={nowPlaying}
                  keyExtractor={(item) => item.idEvent}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  renderItem={({ item }) => (
                    <GameCard
                      game={item}
                      isFeatured={featuredGame?.idEvent === item.idEvent}
                      onRemove={removeGame}
                      onSetFeatured={setAsFeatured}
                    />
                  )}
                  contentContainerStyle={{ paddingHorizontal: 2 }}
                />
              ) : (
                <View className="bg-white dark:bg-gray-800 rounded-xl shadow-md m-4 p-6 items-center">
                  <Ionicons name="videocam-outline" size={48} color="#9CA3AF" />
                  <Text className="text-gray-500 dark:text-gray-400 text-center mt-4">
                    No games currently playing. Select games from the list below.
                  </Text>
                </View>
              )}
            </View>

            <View className="mt-4">
              <Text className="text-lg font-semibold text-gray-800 dark:text-white px-4 mb-2">
                Available Games
              </Text>
              
              {error && (
                <View className="bg-red-100 dark:bg-red-900 m-4 p-4 rounded-xl">
                  <Text className="text-red-700 dark:text-red-300">{error}</Text>
                </View>
              )}
            </View>
          </>
        }
        renderItem={({ item }) => (
          <TouchableOpacity 
            className="bg-white dark:bg-gray-800 flex-row items-center p-4 mx-4 my-2 rounded-xl shadow-sm"
            onPress={() => addGame(item)}
          >
            <Image 
              source={{ uri: item.strThumb || 'https://via.placeholder.com/60x60?text=No+Image' }} 
              className="w-12 h-12 rounded-md"
              resizeMode="cover"
            />
            <View className="flex-1 ml-3">
              <Text className="text-gray-800 dark:text-gray-200 font-medium" numberOfLines={1}>
                {item.strEvent}
              </Text>
              <Text className="text-gray-500 dark:text-gray-400 text-xs">
                {item.dateEvent} • {item.strTime}
              </Text>
            </View>
            <TouchableOpacity 
              className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full"
              onPress={() => addGame(item)}
            >
              <Ionicons name="add" size={20} color="#3B82F6" />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          !error ? (
            <EmptyState 
              message="No games available at the moment. Pull down to refresh." 
              icon="calendar-outline" 
            />
          ) : null
        }
      />
    </SafeAreaView>
  );
};

export default ManagerHome;
