import { Image } from "expo-image";
import Pdf from "react-native-pdf";
import { colorScheme } from "nativewind";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";
import React, { useCallback, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { router, useLocalSearchParams } from "expo-router";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  ActivityIndicator,
  FlatList,
} from "react-native";

import { Venue } from "@/features/venues/types";
import StatusStateView from "@/components/ui/StatusStateView";
import { useAuthStore } from "@/features/authentication/store";
import useIsomorphicLayoutEffect from "@/hooks/useIsomorphicLayoutEffect";
import {
  useVenueDetail,
  useVenueDocuments,
  useVenueImages,
  useVenueStatusUpdate,
} from "@/features/venues/hooks";
import colors from "tailwindcss/colors";

const PLACEHOLDER_IMAGE =
  "https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg";

const Tab = createMaterialTopTabNavigator();

const VenueDetailScreen = () => {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const user = useAuthStore((state) => state.user);
  const { data: venue, isPending, isError, error } = useVenueDetail(id);

  const {
    data: images,
    isPending: isImagesPending,
    isError: isImagesError,
    error: imagesError,
  } = useVenueImages(id);

  const {
    data: documents,
    isPending: isDocumentsPending,
    isError: isDocumentsError,
    error: documentsError,
  } = useVenueDocuments(id);

  const [isStatusModalVisible, setIsStatusModalVisible] = React.useState(false);
  const updateVenueStatus = useVenueStatusUpdate();

  useIsomorphicLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const isDarkMode = colorScheme.get() === "dark";

  const [previewVisible, setPreviewVisible] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const formatDocumentType = (type: string) => {
    return type
      .replace("upload-", "")
      .replace(/-/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const getIconName = (mimeType: string) => {
    if (mimeType?.includes("pdf")) return "document-text";
    if (mimeType?.includes("image")) return "image";
    return "document";
  };

  const handlePreview = (url: string) => {
    setSelectedUrl(url);
    setPreviewVisible(true);
    setIsLoading(true);
  };

  const renderPreviewModal = useCallback(
    () => (
      <Modal
        visible={previewVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setPreviewVisible(false)}
      >
        <TouchableWithoutFeedback>
          <View className="flex-1 bg-black/80 dark:bg-black/90 justify-center items-center">
            <TouchableWithoutFeedback>
              <View
                className={`w-[90%] h-[90%] bg-white dark:bg-gray-700 rounded-xl overflow-hidden`}
              >
                {selectedUrl &&
                  (selectedUrl.endsWith(".pdf") ? (
                    <Pdf
                      trustAllCerts={false}
                      source={{ uri: selectedUrl, cache: true }}
                      style={{ flex: 1, width: "100%", height: "100%" }}
                      onError={(error) => {
                        console.error("PDF Error:", error);
                        setIsLoading(false);
                        setPreviewVisible(false);
                      }}
                    />
                  ) : (
                    <Image
                      source={{ uri: selectedUrl }}
                      style={{ width: "100%", height: "100%" }}
                      contentFit="contain"
                      onError={(error) => {
                        console.error("Image Error:", error);
                        setIsLoading(false);
                        setPreviewVisible(false);
                      }}
                    />
                  ))}
                <TouchableOpacity
                  className="absolute top-4 right-4 bg-white/90 dark:bg-gray-700 p-2 rounded-full shadow-md"
                  onPress={() => setPreviewVisible(false)}
                >
                  <Ionicons
                    name="close"
                    size={24}
                    color={isDarkMode ? "#fff" : "#1f2937"}
                  />
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    ),
    [previewVisible, selectedUrl, isLoading, setIsLoading, setPreviewVisible]
  );

  const handleStatusChange = (newStatus: Venue["status"]) => {
    if (!venue?.id) return;
    updateVenueStatus.mutate(
      {
        id: venue.id,
        status: newStatus,
        is_active: newStatus === "published",
      },
      {
        onSuccess: () => setIsStatusModalVisible(false),
      }
    );
  };

  const renderStatusModal = () => (
    <Modal
      transparent={true}
      visible={isStatusModalVisible}
      animationType="slide"
      onRequestClose={() => setIsStatusModalVisible(false)}
    >
      <TouchableWithoutFeedback onPress={() => setIsStatusModalVisible(false)}>
        <View className="flex-1 justify-end bg-black/60">
          <View className="bg-white rounded-t-3xl p-6">
            <Text className="text-xl font-semibold mb-4 text-gray-800">
              Change Status
            </Text>
            {(["draft", "published", "archived"] as Venue["status"][])
              .filter((status) => status !== venue?.status)
              .map((status) => (
                <TouchableOpacity
                  key={status}
                  className="py-3 border-b border-gray-100"
                  onPress={() => handleStatusChange(status)}
                >
                  <Text className="text-lg text-gray-700 capitalize">
                    {status}
                  </Text>
                </TouchableOpacity>
              ))}
            <TouchableOpacity
              className="py-3 mt-2"
              onPress={() => setIsStatusModalVisible(false)}
            >
              <Text className="text-center text-red-500 text-lg">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

  const DetailsTab = () => (
    <ScrollView
      className="flex-1 bg-blue-50 dark:bg-gray-900"
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      <View className="px-4 pt-4">
        <View className="bg-white dark:bg-gray-700 rounded-2xl p-5 shadow-md mb-6">
          <Text className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            {venue?.name}
          </Text>

          {user?.role !== "user" && (
            <View className="flex-row justify-between items-center mb-4">
              {updateVenueStatus.isPending ? (
                <ActivityIndicator size="small" color="#3b82f6" />
              ) : (
                <View
                  className={`px-3 py-1 rounded-full ${
                    venue?.status === "published"
                      ? "bg-green-100"
                      : venue?.status === "draft"
                      ? "bg-amber-100"
                      : "bg-red-100"
                  }`}
                >
                  <Text
                    className={`text-sm font-medium capitalize ${
                      venue?.status === "published"
                        ? "text-green-700"
                        : venue?.status === "draft"
                        ? "text-amber-700"
                        : "text-red-700"
                    }`}
                  >
                    {venue?.status}
                  </Text>
                </View>
              )}
              <TouchableOpacity
                className="bg-blue-500 px-4 py-1.5 rounded-full"
                onPress={() => setIsStatusModalVisible(true)}
              >
                <Text className="text-white text-sm">Change Status</Text>
              </TouchableOpacity>
            </View>
          )}

          {venue?.average_rating && (
            <View className="flex-row items-center mb-2">
              <Ionicons name="star" size={18} color="#eab308" />
              <Text className="ml-1 text-gray-600 dark:text-gray-100">
                {venue?.average_rating.toFixed(1)} Rating
              </Text>
            </View>
          )}

          <Text className="text-gray-600 dark:text-gray-100">
            {venue?.description || "No description available"}
          </Text>
        </View>

        {/* Details Section */}
        <View className="bg-white dark:bg-gray-700 rounded-2xl p-5 shadow-md mb-6">
          <Text className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
            Venue Details
          </Text>
          <View className="space-y-3">
            <View className="flex-row items-center">
              <Ionicons name="people" size={20} color="#64748b" />
              <Text className="ml-2 text-gray-600 dark:text-gray-100">
                Capacity: {venue?.capacity || "N/A"}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="location" size={20} color="#64748b" />
              <Text className="ml-2 text-gray-600 dark:text-gray-100">
                {venue?.address}
              </Text>
            </View>
            {venue?.contact_phone && user?.role !== "user" && (
              <View className="flex-row items-center">
                <Ionicons name="call" size={20} color="#64748b" />
                <Text className="ml-2 text-gray-600 dark:text-gray-100">
                  {venue?.contact_phone}
                </Text>
              </View>
            )}
            {venue?.contact_email && (
              <View className="flex-row items-center">
                <Ionicons name="mail" size={20} color="#64748b" />
                <Text className="ml-2 text-gray-600 dark:text-gray-100">
                  {venue?.contact_email}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Amenities */}
        {venue?.amenities && venue?.amenities?.length > 0 && (
          <View className="bg-white dark:bg-gray-700 rounded-2xl p-5 shadow-md mb-6">
            <Text className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
              Amenities
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {venue?.amenities?.map((amenity, index) => (
                <View
                  key={index}
                  className="bg-blue-100 dark:bg-blue-700 px-3 py-1 rounded-full"
                >
                  <Text className="text-blue-700 dark:text-blue-100 text-sm">
                    {amenity}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Map */}
        <View className="bg-white dark:bg-gray-700 rounded-2xl p-5 shadow-md mb-6">
          <Text className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
            Location
          </Text>
          <MapView
            style={{ width: "100%", height: 200, borderRadius: 12 }}
            initialRegion={{
              latitude: Number(venue?.latitude),
              longitude: Number(venue?.longitude),
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker
              coordinate={{
                latitude: Number(venue?.latitude),
                longitude: Number(venue?.longitude),
              }}
              title={venue?.name}
              description={venue?.address}
            />
          </MapView>
        </View>
      </View>
    </ScrollView>
  );

  const DocumentsView = () => {
    if (isDocumentsPending)
      return (
        <StatusStateView status="pending" message="Loading documents..." />
      );
    if (isDocumentsError)
      return (
        <StatusStateView
          status="error"
          error={documentsError}
          message="Something went wrong"
        />
      );

    return (
      <View className={`flex-1 bg-blue-50 dark:bg-gray-900 px-4 pt-4`}>
        <FlatList
          data={documents}
          keyExtractor={(item, index) => `${item.document_type}-${index}`}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            return (
              <View className="bg-white dark:bg-gray-700 rounded-xl mb-3 shadow-md p-4">
                <View className="flex-row items-center mb-2">
                  <Ionicons
                    name={getIconName('document-text')}
                    size={24}
                    color={isDarkMode ? "#a1a1aa" : "#64748b"}
                  />
                  <View className="ml-3 flex-1">
                    <Text className="text-gray-800 dark:text-gray-100 font-medium">
                      {formatDocumentType(item.document_type)}
                    </Text>
                    {/* <Text className="text-gray-500 text-sm dark:text-gray-400">
                      {item?.document_url.length} file
                      {item?.document_url.length > 1 ? "s" : ""} ({'document-text'})
                    </Text> */}
                  </View>
                </View>
                <View className="flex-row flex-wrap gap-2">
                    <TouchableOpacity
                      className="bg-blue-50 p-2 rounded-lg flex-row items-center"
                      onPress={() => handlePreview(item.document_url)}
                    >
                      <Ionicons
                        name="eye-outline"
                        size={16}
                        color={isDarkMode ? "#60a5fa" : "#3b82f6"}
                      />
                      <Text className="ml-1 text-blue-600 text-sm">
                        Preview {item.document_url.split(".").pop()}
                      </Text>
                    </TouchableOpacity>
                 
                </View>
              </View>
            );
          }}
          ListEmptyComponent={
            <Text className="text-gray-500 dark:text-gray-400 text-center mt-10">
              No documents available
            </Text>
          }
        />
        {renderPreviewModal()}
      </View>
    );
  };

  const PhotosView = () => {
    if (isImagesPending)
      return (
        <StatusStateView status="pending" message="Loading photos..." />
      );
    if (isImagesError)
      return (
        <StatusStateView
          status="error"
          error={imagesError}
          message="Something went wrong"
        />
      );

    
    return (
      <View className={`flex-1 bg-blue-50 dark:bg-gray-900 px-4 pt-4`}>
        <FlatList
          data={images}
          keyExtractor={(item, index) => `photo-${index}`}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <TouchableOpacity 
              className="mb-4 rounded-xl overflow-hidden shadow-md"
              onPress={() => handlePreview(item.photo_url)}
            >
              <Image
                source={{ uri: item.photo_url }}
                style={{ width: "100%", height: 200 }}
                contentFit="cover"
              />
              <View className="absolute bottom-0 left-0 right-0 bg-black/50 p-2">
                <Text className="text-white font-medium">
                  Photo {index + 1}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text className="text-gray-500 dark:text-gray-400 text-center mt-10">
              No photos available
            </Text>
          }
        />
        {renderPreviewModal()}
      </View>
    );
  }

  if (isPending)
    return <StatusStateView status="pending" message="Loading venue..." />;
  if (isError)
    return (
      <StatusStateView
        status="error"
        error={error}
        message="Something went wrong"
      />
    );
  if (!venue)
    return <StatusStateView status="empty" message="Venue not found" />;



  const placeholder = images?.[0]?.photo_url;
  const userRole =user?.role;

  return (
    <View className="flex-1 bg-blue-50">
      <StatusBar style="light" />
      <View className="relative">
        <Image
          source={{ uri: placeholder || PLACEHOLDER_IMAGE }}
          style={{ width: "100%", height: 240 }}
          contentFit="cover"
        />
        <TouchableOpacity
          className="absolute top-12 left-4 bg-white/90 p-2 rounded-full shadow-md"
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: "#3b82f6",
            tabBarInactiveTintColor: "#64748b",
            tabBarIndicatorStyle: { backgroundColor: "#3b82f6" },
            tabBarStyle: {
              backgroundColor: isDarkMode ? colors.gray[700] : colors.gray[100],
              elevation: 2,
            },
            tabBarLabelStyle: {
              fontSize: 14,
              fontWeight: "600",
              color: isDarkMode ? colors.gray[100] : colors.gray[700],
            },
          }}
        >
          <Tab.Screen name="Details" component={DetailsTab} />
         {user?.role !== "user" && <Tab.Screen name="Documents" component={DocumentsView} />}
         <Tab.Screen name="Photos" component={PhotosView} />
        </Tab.Navigator>
 

      {renderStatusModal()}
    </View>
  );
};

export default VenueDetailScreen;
