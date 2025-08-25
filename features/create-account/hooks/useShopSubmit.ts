import { useState } from "react";
import { router } from "expo-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn } from "react-hook-form";

import { ShopFormData, shopSchema } from "../validation/shopValidationScheme";
import { useManagerOnboardingStore } from "../store/managerOnboardingStore";

export const useShopSubmit = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updateShopData, shopData } = useManagerOnboardingStore();

  const methods = useForm<ShopFormData>({
    resolver: zodResolver(shopSchema),
    mode: "onChange",
    defaultValues: {
      name: shopData?.name || "",
      description: shopData?.description || "",
      address: shopData?.address || "",
      longitude: shopData?.longitude ?? 0,
      latitude: shopData?.latitude ?? 0,
      amenities: shopData?.amenities || [],
      capacity: shopData?.capacity || "",
      pricing: shopData?.pricing || "",
      redemption_option: shopData?.redemption_option || "redeemable",
      contact_phone: shopData?.contact_phone || "",
      contact_email: shopData?.contact_email || "",
    },
  });

  const onSubmit = async (data: ShopFormData) => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    updateShopData(data);
    router.push("/(auth)/(manager-onboarding)/step-three");
    setIsSubmitting(false);
    return true;
  };

  return {
    methods,
    onSubmit,
    isSubmitting,
    shopData,
  } as {
    methods: UseFormReturn<ShopFormData>;
    onSubmit: (data: ShopFormData) => Promise<true>;
    isSubmitting: boolean;
    shopData: ShopFormData;
  };
};
