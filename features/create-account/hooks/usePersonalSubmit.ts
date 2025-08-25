import { useState } from "react";
import { router } from "expo-router";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useManagerOnboardingStore } from "../store/managerOnboardingStore";
import {
  personalFormData,
  personalSchema,
} from "../validation/personalValidationSchema";

export const usePersonalSubmit = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { personalData, setPersonalData } = useManagerOnboardingStore();

  const methods = useForm<personalFormData>({
    resolver: zodResolver(personalSchema),
    mode: "onChange",
    defaultValues: {
      first_name: personalData?.first_name || "",
      last_name: personalData?.last_name || "",
      email: personalData?.email || "",
      password: personalData?.password || "",
      username: personalData?.username || "",
      phone_number: personalData?.phone_number || "",
    },
  });

  const onSubmit = async (data: personalFormData) => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    setPersonalData(data);
    router.push("/(auth)/(manager-onboarding)/step-two");
    setIsSubmitting(false);
    return true;
  };

  return {
    methods,
    onSubmit,
    isSubmitting,
  } as {
    methods: UseFormReturn<personalFormData>;
    onSubmit: (data: personalFormData) => Promise<true>;
    isSubmitting: boolean;
  };
};
