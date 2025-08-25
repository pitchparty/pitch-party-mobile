import React from "react";
import { toast } from "sonner-native";
import { useCreateBooking } from "@/features/bookings/hooks";
import ThemedButton from "@/components/ui/ThemedButton";
import { VenueWithManager } from "@/features/venues/types";
import { EplEvent } from "@/features/premierLeague/types/event";
import { View } from "react-native";
// import { UserRole } from "@/features/authentication/types";

interface BookingActionsProps {
  userId: string;
  selectedMatch?: EplEvent;
  selectedVenue?: VenueWithManager;
  ticketCount: number;
  specialRequests: string;
  user?: any;
  setPaymentUrl: (url: string | null) => void;
  setBookingData: (data: any) => void;
  setShowSuccessModal: (show: boolean) => void;
  handleCloseModal: () => void;
}

const BookingActions = ({
  userId,
  selectedMatch,
  selectedVenue,
  ticketCount,
  specialRequests,
  user,
  setPaymentUrl,
  setBookingData,
  setShowSuccessModal,
  handleCloseModal
}: BookingActionsProps) => {
  const createBooking = useCreateBooking();

  const handleSubmit = () => {
    if (!selectedMatch || !selectedVenue) {
      toast.warning("Please select a match and venue");
      return;
    }

    const submitData = {
      user_id: userId,
      league: selectedMatch.strLeague,
      away_team: selectedMatch.strAwayTeam,
      away_team_logo: selectedMatch.strAwayTeamBadge,
      home_team: selectedMatch.strHomeTeam,
      home_team_logo: selectedMatch.strHomeTeamBadge,
      event_date: selectedMatch.dateEvent,
      event_time: selectedMatch.strTime,
      event_venue: selectedMatch.strVenue,
      venue_id: selectedVenue.id,
      party_size: ticketCount,
      amount: (Number(ticketCount) * Number(selectedVenue.pricing)).toString(),
      special_requests: specialRequests,
      status: "pending",
      billing_address: {
        email_address: user?.email as string,
        phone_number: user?.phone as string,
        country_code: "KE",
        first_name:user?.first_name,
        last_name:user?.last_name,
      },
    };


    console.log("Submitting data:", submitData);

    createBooking.mutate(submitData, {
      onSuccess: (data) => {
        console.log("Payment URL:", data.paymentResponse.redirect_url);
        handleCloseModal()
        toast.success("Booking created successfully");
        setPaymentUrl(data.paymentResponse.redirect_url);
        // Uncomment if success modal is preferred over WebView
        // setBookingData({ ...data });
        // setShowSuccessModal(true);
      },
      onError: (error) => {
        toast.error("Failed to create booking");
        console.error("Failed to create booking", error);
      },
    });
  };

  return (
    <View className="p-4">
      <ThemedButton
        label={createBooking.isPending ? "Please wait..." : "Book Now"}
        onPress={handleSubmit}
        disabled={createBooking.isPending}
        isLoading={createBooking.isPending}
      />
    </View>
  );
};

export default BookingActions;
