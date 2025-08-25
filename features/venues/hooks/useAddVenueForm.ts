import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAddVenueStore } from "../store/useAddVenueStore";
import { initialVenueValues, VenueFormData, venueSchema } from "../schema";
import { router } from "expo-router";


export const useAddVenueForm = () => {
  const { venueData, setVenueData } = useAddVenueStore();

  const methods = useForm<VenueFormData>({
    resolver: zodResolver(venueSchema),
    mode: "onChange",
    defaultValues: venueData ?? initialVenueValues,
  });

  const onSubmit = (data: VenueFormData) => {
    setVenueData(data);
    router.push("/venues/add/upload-documents");
  };

  return { methods, venueData, onSubmit: methods.handleSubmit(onSubmit), };
};
