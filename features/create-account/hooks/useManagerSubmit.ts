import { useState } from "react";
import { toast } from "sonner-native";

import { useManagerOnboardingStore } from "../store/managerOnboardingStore";

export const useManagerSubmit = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { personalData, shopData, setOnboardingProgress } =
    useManagerOnboardingStore();

  const onManagerSubmit = () => {
    if (!personalData || !shopData) {
      toast.error("Missing personal or shop data");
      console.error("Missing personal or shop data");
      return;
    }

    setIsSubmitting(true);

    const submitData = {
      ...personalData,
      venue: { ...shopData },
    };

    fetch("https://nrchxicfpvstsyhaceyj.supabase.co/functions/v1/swift-task", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(submitData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        toast.success("Submission successful");

        setIsSubmitting(false);

        setOnboardingProgress({
          managerId: data.user_id!,
          shopId: data.venueId!,
          documentsUploaded: false,
          photosUploaded: false,
        });
      })
      .catch((error) => {
        setIsSubmitting(false);

        toast.error("Submission failed");

        console.error("Error:", error);
      });
  };

  return {
    isSubmitting,
    setIsSubmitting,
    onManagerSubmit,
  };
};
