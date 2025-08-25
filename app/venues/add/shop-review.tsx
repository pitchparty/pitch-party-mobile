import React from "react";
import { router } from "expo-router";
import * as Linking from "expo-linking";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import FormButtons from "@/features/create-account/components/FormButtons";
import SuccessModal from "@/features/create-account/components/SuccessModal";
import { useNewShopReviewSubmit } from "@/features/create-account/hooks/useNewShopReview";
import { useNewShopStore } from "@/features/create-account/store/useNewShopStore";
import { useAddVenueStore } from "@/features/venues/store/useAddVenueStore";
import { useAddVenueSubmit } from "@/features/venues/hooks/useAddVenueSubmit";



const documentLabels = {
  business_registration: "Business Registration",
  legal_document: "Legal Documents",
  tax_compliance: "Tax Compliance",
  permit_license: "Permit License",
  national_id: "National ID",
  health_safety: "Health Safety",
} as const;

export default function ShopReview() {
  const { venueData, documents, venuePhotos } =
    useAddVenueStore();
  const { isSubmitting, submit, isSuccessModalVisible, closeModal } =
  useAddVenueSubmit();

  const renderPdfBox = (label: string, uri: string) => (
    <TouchableOpacity
      key={label}
      onPress={() => Linking.openURL(uri)}
      className="w-1/3 p-1 items-center"
    >
      <View className="w-20 h-20 rounded bg-gray-200 items-center justify-center mb-1">
        <Text className="text-xs text-center text-gray-700" numberOfLines={2}>
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView className="flex-1 p-4 bg-white">
      {/* Shop Information */}
      <View className="bg-gray-50 rounded-lg p-4 mb-4 relative">
        <Text className="text-lg font-semibold mb-4">Shop Information.</Text>
        <InfoRow label="Shop Name" value={venueData?.name ?? "-"} />
        <InfoRow label="Address" value={venueData?.address ?? "-"} />
        <InfoRow label="Capacity" value={venueData?.capacity ?? "-"} />
        <InfoRow label="Pricing" value={venueData?.pricing ?? "-"} />
        <InfoRow label="Contact" value={venueData?.contact_phone ?? "-"} />
        {/* <EditButton path="/(manager-onboarding)/step-two" /> */}
      </View>

      {/* Documents */}
      <View className="bg-gray-50 rounded-lg p-4 mb-4 relative">
        <Text className="text-lg font-semibold mb-4">Documents</Text>
        <View className="flex-row flex-wrap mb-2">
          {venuePhotos?.[0] && (
            <View className="w-1/3 p-1 items-center">
              <View>
                <Image
                  source={{ uri: venuePhotos[0].uri }}
                  className="w-20 h-20 rounded mb-1"
                />
                <Text className="absolute top-1 right-1 bg-black/50 text-white px-1 rounded text-xs">
                  {venuePhotos.length}
                </Text>
              </View>
              <Text className="text-xs text-center text-gray-600">
                Shop Photo
              </Text>
            </View>
          )}
          {Object.entries(documentLabels).map(([key, label]) => {
            const doc = documents.find((d) => d.key === key);
            return doc ? renderPdfBox(label, doc.uri) : null;
          })}
        </View>
        {/* <EditButton path="/(manager-onboarding)/step-three" /> */}
      </View>

      <FormButtons
        onPrevious={() => router.back()}
        onNext={submit}
        isValid={true}
        isSubmitting={isSubmitting}
      />
      <SuccessModal
        isVisible={isSuccessModalVisible}
        onClose={closeModal}
        onConfirm={closeModal}
      />
    </ScrollView>
  );
}

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View className="flex-row mb-2">
    <Text className="w-[100px] font-medium text-gray-600">{label}::</Text>
    <Text className="flex-1 text-gray-800">{value}</Text>
  </View>
);

// const EditButton = ({ path }: { path: string }) => (
//   <TouchableOpacity
//     className="absolute top-4 right-4 bg-gray-200 px-3 py-1.5 rounded"
//     onPress={() => router.push(path)}
//   >
//     <Text className="text-gray-600 font-medium">Edit</Text>
//   </TouchableOpacity>
// );
