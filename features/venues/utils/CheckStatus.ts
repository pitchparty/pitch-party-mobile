import { VenueDetailsWithManager } from "../types";

// Helper/Util function to check if basic venue data is available
export const isVenueDataAvailable = (venue: VenueDetailsWithManager): boolean => {
  return !!venue.name && !!venue.address && !!(venue.amenities && venue.amenities.length > 0) && !!venue.pricing;
};

interface DocumentsAvailability {
  totalDocuments: number;
  hasAllDocuments: boolean;
  emptyDocumentUrls: number;
}

// Helper/Util function to check the availability of documents
export const checkDocumentsAvailability = (venue: VenueDetailsWithManager): DocumentsAvailability => {
  const totalExpectedDocuments = 6;
  const allDocuments = venue.documents;
  const totalDocuments = allDocuments ? allDocuments.length : 0;
  const emptyDocumentUrls = allDocuments
    ? allDocuments.filter((doc) => !doc.asset_url).length
    : totalExpectedDocuments; // Assume all are missing if venue_documents is null/undefined
  const hasAllDocuments = totalDocuments === totalExpectedDocuments && emptyDocumentUrls === 0;

  return {
    totalDocuments,
    hasAllDocuments,
    emptyDocumentUrls,
  };
};