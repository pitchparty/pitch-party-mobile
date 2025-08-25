import React from "react";
import { Image } from "expo-image";
import colors from "tailwindcss/colors";
import { useNavigation } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";

import { formatCurrency } from "@/utils/formatters";
import StatusStateView from "@/components/ui/StatusStateView";
import { useAuthStore } from "@/features/authentication/store";
import useIsomorphicLayoutEffect from "@/hooks/useIsomorphicLayoutEffect";
import { getBookingStatusStyles } from "@/features/bookings/utils/getBookingStatusStyles";
import { getPaymentStatusStyles } from "@/features/bookings/utils/getPaymentStatusStyles";
import BookingCancellationModal from "@/features/bookings/components/BookingCancellationModal";
import {
  useCancelBooking,
  useConfirmBooking,
  useSingleBooking,
} from "@/features/bookings/hooks";
import { BookingQueryParams } from "@/features/bookings/types";
import { useGlobalSearchParams } from "expo-router";

const BookingDetailsPage: React.FC = () => {
  const navigation = useNavigation();
  const params = useGlobalSearchParams<{
    id?: string;
    orderMerchantReference?: string;
  }>();


  const user = useAuthStore((state) => state.user);

  useIsomorphicLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "Booking Details",
      headerShadowVisible: false,
      headerTitleStyle: { fontWeight: "bold" },
      headerStyle: { backgroundColor: colors.blue[600] },
      headerTintColor: "#fff",
    });
  }, [navigation]);

  const [modalVisible, setModalVisible] = React.useState(false);

  const queryParams: BookingQueryParams = {
    id: params.id,
    orderMerchantReference: params.orderMerchantReference,
  };

  const { data, isPending, isError, error } = useSingleBooking(queryParams);

  const { mutate: confirmBooking, isPending: confirmPending } =
    useConfirmBooking();
  const { mutate: cancelBooking, isPending: cancelPending } =
    useCancelBooking();

  if (isPending)
    return (
      <StatusStateView status="pending" message="Loading booking details..." />
    );
  if (error)
    return (
      <StatusStateView
        status="error"
        message="Something went wrong"
        error={error}
      />
    );
  if (!data)
    return <StatusStateView status="empty" message="Booking not found" />;

  const handleConfirm = () => {
    confirmBooking(data?.id);
  };

  const handleCancel = () => {
    cancelBooking(data?.id, {
      onSuccess: () => {
        setModalVisible(false);
      },
      onError: (error) => {
        console.error("Failed to cancel booking:", error);
      },
    });
  };

  return (
    <View className="flex-1 bg-blue-50 dark:bg-gray-900">
      <View className="bg-blue-600 pb-4 px-4 rounded-b-3xl shadow-lg">
        <View className="mt-4 flex-row items-center">
          <View className="w-14 h-14 bg-indigo-800 rounded-full justify-center items-center mr-4">
            <Text className="text-white text-xl font-bold">
              {data.user?.first_name?.charAt(0) +
                data.user?.last_name?.charAt(0) || "U"}
            </Text>
          </View>
          <View>
            <Text className="text-white text-lg font-bold">
              {data.user?.first_name} {data.user?.last_name}
            </Text>
            <Text className="text-gray-100">Booking #{data.booking_code}</Text>
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-4 pt-6 pb-20"
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Match Card */}
        <View className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden mb-6 shadow-lg">
          <View className="w-full bg-indigo-800 px-4 py-2">
            <Text className="text-indigo-100 font-medium">{data.league}</Text>
          </View>

          <View className="p-5">
            <View className="flex-row justify-between items-center mb-4">
              <TeamDisplay
                name={data.home_team}
                logoUrl={data.home_team_logo}
              />
              <View className="items-center px-4">
                <Text className="dark:text-gray-400 text-gray-500 text-sm">
                  VS
                </Text>
                {/* <Text className="dark:text-white text-xl font-bold mt-1">
                  {data.event_time}
                </Text> */}
              </View>
              <TeamDisplay
                name={data.away_team}
                logoUrl={data.away_team_logo}
              />
            </View>

            {/* <View className="flex-row items-center mt-2 border-t border-gray-700 pt-4">
              <Ionicons name="calendar" size={16} color={colors.blue[600]} />
              <Text className="text-gray-800 dark:text-gray-400 ml-2">
                {data.event_date}
              </Text>
            </View> */}

            {/* <View className="flex-row items-center mt-2">
              <Ionicons name="location" size={16} color={colors.blue[600]} />
              <Text className="text-gray-800 dark:text-gray-300 ml-2">Stadium: {data.venues?.name}</Text>
            </View> */}
          </View>
        </View>

        {/* Venue Details */}
        <View className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden mb-6 shadow-lg">
          <View className="w-full bg-indigo-800 px-4 py-2">
            <Text className="text-indigo-100 font-medium">Venue Details</Text>
          </View>
          <View className="p-4">
            <Text className="dark:text-gray-400 text-lg font-semibold text-gray-800">
              {data.venues?.name}
            </Text>
            <Text className="dark:text-gray-400 text-gray-600">
              {data.venues?.address}
            </Text>

            <View className="flex-row flex-wrap gap-2 mt-4">
              {data.venues?.amenities?.map((amenity, index) => (
                <AmenityBadge key={index} name={amenity} />
              ))}
            </View>
          </View>
        </View>

        {/* Status & Payment */}
        <View className="flex-1 flex-row justify-between mb-6">
          <BookingStatusBadge label="Booking Status" status={data.status} />
          <PaymentStatusBadge label="Payment" status={data.payment_status} />
        </View>

        {/* Booking Details */}
        <View className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-6">
          <Text className="dark:text-white text-lg font-bold mb-4">
            Booking Details
          </Text>
          <DetailRow label="Party Size" value={`${data.party_size} people`} />
          <DetailRow label="Amount" value={formatCurrency(data.amount)} />
          <DetailRow
            label="Special Requests"
            value={data.special_requests || "None"}
          />
        </View>

        {/* Contact Info */}
        <View className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-6">
          <Text className="dark:text-white text-lg font-bold mb-4">
            Contact Information
          </Text>
          <ContactItem
            icon="person"
            value={
             user?.role === "manager"
                ? data?.user?.first_name + " " + data?.user?.last_name
                : data?.venues?.manager.first_name
            }
          />
          <ContactItem
            icon="call"
            value={
             user?.role === "manager"
                ? data?.venues?.contact_phone
                : data?.user?.phone_number
            }
          />
          {/* <ContactItem icon="mail" value={data.user?.email} /> */}
        </View>

        {/* Action Buttons */}
        <View className="flex-row mb-8">
          {user?.user_metadata?.role === "manager" &&
            data.status === "pending" && (
              <TouchableOpacity
                className="flex-1 bg-green-600 p-4 rounded-xl mr-2 flex-row justify-center items-center"
                disabled={confirmPending}
                onPress={handleConfirm}
              >
                <Ionicons
                  name="checkmark-circle-outline"
                  size={20}
                  color="white"
                />
                <Text className="text-white ml-2 font-semibold">
                  {confirmPending ? "Confirming..." : "Confirm Booking"}
                </Text>
              </TouchableOpacity>
            )}
          {data.status === "cancelled" || data.status === "confirmed" ? null : (
            <TouchableOpacity
              className="flex-1 bg-red-700 p-4 rounded-xl ml-2 flex-row justify-center items-center"
              disabled={cancelPending}
              onPress={() => setModalVisible(true)}
            >
              <Ionicons name="close-circle-outline" size={20} color="white" />
              <Text className="text-white ml-2 font-semibold">
                {cancelPending ? "Cancelling..." : "Cancel Booking"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
      <BookingCancellationModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={handleCancel}
        eventDate={data.event_date}
        eventTime={data.event_time}
        userRole={user?.user_metadata.role}
      />
    </View>
  );
};

export default BookingDetailsPage;

const ContactItem = ({ icon, value }: { icon: string; value: string }) => {
  const isCall = icon === "call";

  const handlePress = () => {
    if (isCall) {
      Linking.openURL(`tel:${value}`);
    }
  };

  return (
    <View className="flex-row items-center my-2">
      <Ionicons
        name={icon as keyof typeof Ionicons.glyphMap}
        size={16}
        color={colors.blue[600]}
      />
      {isCall ? (
        <Text
          className="dark:text-gray-300 ml-2 text-blue-600"
          onPress={handlePress}
          style={{ textDecorationLine: "underline" }}
        >
          {value}
        </Text>
      ) : (
        <Text className="dark:text-gray-300 ml-2">{value}</Text>
      )}
    </View>
  );
};

const TeamDisplay = ({ name, logoUrl }: { name: string; logoUrl?: string }) => (
  <View className="items-center flex-1">
    <Image source={logoUrl} style={{ height: 80, width: 80 }} />
    <Text className="dark:text-white font-bold text-lg">{name}</Text>
  </View>
);

const AmenityBadge = ({ name }: { name: string }) => (
  <View className="flex-row items-center border border-gray-700 dark:border-gray-300 px-2 py-1 rounded-full">
    <MaterialCommunityIcons
      name={getAmenityIcon(name)}
      size={16}
      color="black"
    />
    <Text className="dark:text-white ml-1 text-xs">{name}</Text>
  </View>
);

const PaymentStatusBadge = ({
  label,
  status,
}: {
  label: string;
  status: string;
}) => {
  console.log("STATUS", status);
  const { bg, text, label: statusLabel } = getPaymentStatusStyles(status);

  return (
    <View className="bg-white dark:bg-gray-800 p-4 rounded-xl w-44">
      <Text className="text-gray-800 dark:text-gray-400 text-sm">{label}</Text>
      <View className="flex-row items-center mt-1">
        <View className={`w-3 h-3 rounded-full ${bg} mr-2`} />
        <Text className={`dark:text-white font-semibold capitalize ${text}`}>
          {/* {statusLabel} */}
          {status}
        </Text>
      </View>
    </View>
  );
};

const BookingStatusBadge = ({
  label,
  status,
}: {
  label: string;
  status: string;
}) => {
  const { bg, text, label: statusLabel } = getBookingStatusStyles(status);

  return (
    <View className="bg-white dark:bg-gray-800 p-4 rounded-xl w-44">
      <Text className="text-gray-800 dark:text-gray-400 text-sm">{label}</Text>
      <View className="flex-row items-center mt-1">
        <View className={`w-3 h-3 rounded-full ${bg} mr-2`} />
        <Text className={`dark:text-white font-semibold capitalize ${text}`}>
          {statusLabel}
        </Text>
      </View>
    </View>
  );
};

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <View className="flex-row justify-between py-3 border-b border-gray-100 dark:border-gray-700">
    <Text className="dark:text-gray-400">{label}</Text>
    <Text className="dark:text-white">{value}</Text>
  </View>
);

const getAmenityIcon = (amenity: string): string => {
  const amenityIcons: Record<string, string> = {
    WiFi: "wifi",
    "4K TV": "television",
    Food: "food",
    Parking: "parking",
    Bar: "glass-mug-variant",
    Sports: "basketball",
    VIP: "shield-star",
  };

  return amenityIcons[amenity] || "information";
};
