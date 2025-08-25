import { create } from "zustand";
import { VenueFormData } from "../schema";
import { DocumentFile } from "@/features/create-account/store/managerOnboardingStore";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type DocumentKey =
  | "legal_document"
  | "business_registration"
  | "tax_compliance"
  | "permit_license"
  | "national_id"
  | "health_safety";


interface AddVenueStore {
  venueData: VenueFormData | null;
  documents: DocumentFile[];
  venuePhotos: DocumentFile[];
  setVenueData: (data: VenueFormData) => void;
  addDocument: (doc: DocumentFile) => void;
  removeDocument: (key: DocumentKey) => void;
  addVenuePhotos: (photos: DocumentFile[]) => void;
  removeVenuePhoto: (uri: string) => void;
  reset: () => void;
}

export const useAddVenueStore = create<AddVenueStore>()(persist((set) => ({
  venueData: null,
  documents: [],
  venuePhotos: [],
  setVenueData: (data) => set({ venueData: data }),
  addDocument: (doc) =>
    set((state) => ({ documents: [...state.documents, doc] })),
  removeDocument: (key) =>
    set((state) => ({
      documents: state.documents.filter((doc) => doc.key !== key),
    })),
  addVenuePhotos: (photos) =>
    set((state) => ({ venuePhotos: [...state.venuePhotos, ...photos] })),
  removeVenuePhoto: (uri) =>
    set((state) => ({
      venuePhotos: state.venuePhotos.filter((photo) => photo.uri !== uri),
    })),
  reset: () =>
    set({
      venueData: null,
      documents: [],
      venuePhotos: [],
    }),
}),{
  name: "add-shop-storage",
  storage: createJSONStorage(() => AsyncStorage),
}
)
);
