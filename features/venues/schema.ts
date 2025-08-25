import * as z from "zod";

export const venueSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
  longitude: z.number(),
  latitude: z.number(),
  amenities: z.array(z.string()).min(1, "At least one amenity is required"),
  capacity: z.string().regex(/^\d+$/, "Capacity is required"),
  pricing: z.string().min(1, "Pricing is required"),
  redemption_option: z.enum(["redeemable", "non-redeemable"]),
  contact_phone: z
    .string()
    .min(10, "Enter a Valid Phone Number"),
  contact_email: z.string().optional(),
  manager_id: z.string().optional(),
});

export const documentSchema = z.object({
  asset_url: z.array(z.string().min(1, "Document URL is required")),
  document_type: z.string().min(1, "Document type is required"),
  mimeType: z.string().min(1, "MIME type is required"),
});

export const documentsSchema = z.object({
  documents: z.array(documentSchema),
});

export type VenueFormData = z.infer<typeof venueSchema>;
export type DocumentData = z.infer<typeof documentSchema>;
export type DocumentsData = z.infer<typeof documentsSchema>;


export const initialDocuments: DocumentsData = {
  documents: [],
};

export const initialVenueValues: VenueFormData = {
  name: "",
  address: "",
  longitude: 0,
  latitude: 0,
  amenities: [],
  capacity: "",
  manager_id: "",
  contact_phone: "",
  contact_email: "",
  pricing: "",
  redemption_option: "redeemable",
};

