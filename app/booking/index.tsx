import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  useEffect,
} from "react";
import { colorScheme } from "nativewind";
import colors from "tailwindcss/colors";
import WebView from "react-native-webview";
import { useNavigation, useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";

import { useAuthStore } from "@/features/authentication/store";
import useIsomorphicLayoutEffect from "@/hooks/useIsomorphicLayoutEffect";
import { useBookingStore } from "@/features/bookings/stores/useBookingStore";

import { VenueWithManager } from "@/features/venues/types";
import { EplEvent } from "@/features/premierLeague/types/event";
import BookingForm from "@/features/bookings/components/BookingForm";
import BookingActions from "@/features/bookings/components/BookingActions";
import { VenueBottomSheet } from "@/features/venues/components/venue-bottom-sheet";
import { MatchBottomSheet } from "@/features/bookings/components/match-bottom-sheet";

const BookingPage = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const user = useAuthStore((state) => state.user);
  const userId = user?.id as string;

  const {
    selectedMatch,
    selectedVenue,
    ticketCount,
    setSelectedMatch,
    setSelectedVenue,
    setTicketCount,
  } = useBookingStore();

  const matchBottomSheetRef = useRef<BottomSheetModal>(null);
  const venueBottomSheetRef = useRef<BottomSheetModal>(null);
  const paymentModalRef = useRef<BottomSheetModal>(null);

  const [specialRequests, setSpecialRequests] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [bookingData, setBookingData] = useState<any>(null);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

  const snapPoints = useMemo(() => ["25%", "50%", "90%"], []);

  useIsomorphicLayoutEffect(() => {
    navigation.setOptions({ title: "Bookings", headerShown: true });
  }, [navigation]);

  // Open PaymentWebView when paymentUrl is set
  useEffect(() => {
    if (paymentUrl) {
      console.log("Opening payment modal with URL:", paymentUrl);
      return paymentModalRef.current?.present();
    }
  }, [paymentUrl]);

  const handleMatchSelection = useCallback(
    () => matchBottomSheetRef.current?.present(),
    []
  );
  const handleVenueSelection = useCallback(
    () => venueBottomSheetRef.current?.present(),
    []
  );
  const handleMatchSelect = useCallback(
    (match: EplEvent) => {
      setSelectedMatch(match);
      matchBottomSheetRef.current?.dismiss();
    },
    [setSelectedMatch]
  );
  const handleVenueSelect = useCallback(
    (venue: VenueWithManager) => {
      setSelectedVenue(venue);
      venueBottomSheetRef.current?.dismiss();
    },
    [setSelectedVenue]
  );
  const handleCloseModal = () => {
    setShowSuccessModal(false);
    setSelectedMatch(undefined);
    setSelectedVenue(undefined);
    setTicketCount(1);
    setSpecialRequests("");
  };

  return (
    <>
      <BookingForm
        ticketCount={ticketCount}
        setTicketCount={setTicketCount}
        specialRequests={specialRequests}
        setSpecialRequests={setSpecialRequests}
        onMatchSelect={handleMatchSelection}
        onVenueSelect={handleVenueSelection}
        selectedVenue={selectedVenue}
      />
      <BookingActions
        userId={userId}
        selectedMatch={selectedMatch}
        selectedVenue={selectedVenue}
        ticketCount={ticketCount}
        specialRequests={specialRequests}
        user={user}
        setPaymentUrl={setPaymentUrl}
        setBookingData={setBookingData}
        setShowSuccessModal={setShowSuccessModal}
        handleCloseModal={handleCloseModal}
      />
      <BottomSheetModal
        ref={matchBottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        enablePanDownToClose
      >
        <MatchBottomSheet onSelect={handleMatchSelect} />
      </BottomSheetModal>
      <BottomSheetModal
        ref={venueBottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        enablePanDownToClose
      >
        <VenueBottomSheet onSelect={handleVenueSelect} />
      </BottomSheetModal>
      <BottomSheetModal
        ref={paymentModalRef}
        index={0}
        snapPoints={["100%"]}
        enablePanDownToClose
        backgroundStyle={{
          backgroundColor:
            colorScheme.get() === "dark" ? colors.gray[800] : colors.blue[50],
        }}
        handleIndicatorStyle={{ display: "none" }}
      >
        <BottomSheetView style={{ flex: 1 }}>
          <View className="px-6 pt-6 mb-6 mt-4 flex-row items-center justify-between">
            <View style={{ width: 40 }} />
            <Text className="text-lg font-bold text-center flex-1">
              Complete Your Payment
            </Text>
            <TouchableOpacity
              onPress={() => {
                paymentModalRef.current?.dismiss();
                setPaymentUrl(null);
                router.replace(`/(user)/user-bookings`);
              }}
            >
              <Text className="text-blue-600 dark:text-blue-400 font-semibold">
                Done
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1, overflow: "hidden", borderRadius: 10 }}>
            <WebView
              source={{ uri: paymentUrl as string }}
              style={{ flex: 1 }}
            />
          </View>
        </BottomSheetView>
      </BottomSheetModal>
     
    </>
  );
};

export default BookingPage;
