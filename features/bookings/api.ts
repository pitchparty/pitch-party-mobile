import { supabase } from "@/lib/supabase";
import { BOOKINGS_SELECT } from "./constants/queries";
import { BookingItem, BookingParams, BookingQueryParams } from "./types";
import { initiatePayment } from "@/lib/pesapal/pesapal.service";
import { PaymentParams } from "@/lib/pesapal/types";
import * as Crypto from "expo-crypto";

const TABLE_NAME = "bookings";

/**
 -------------------------------------------------------

 CREATE BOOKINGS

 -------------------------------------------------------
**/

// Create a new booking
export const createBooking = async (
  bookingParams: BookingParams & PaymentParams
) => {
  const booking_data: BookingParams = {
    amount: bookingParams.amount,
    away_team: bookingParams.away_team,
    away_team_logo: bookingParams.away_team_logo,
    event_date: bookingParams.event_date,
    event_time: bookingParams.event_time,
    event_venue: bookingParams.event_venue,
    home_team: bookingParams.home_team,
    home_team_logo: bookingParams.home_team_logo,
    league: bookingParams.league,
    party_size: bookingParams.party_size,
    special_requests: bookingParams.special_requests,
    status: bookingParams.status,
    user_id: bookingParams.user_id,
    venue_id: bookingParams.venue_id,
  };

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .insert(booking_data)
    .select()
    .single();

  if (error) throw new Error(error.message);

  const payment_data: PaymentParams = {
    id: Crypto.randomUUID(),
    currency: "KES",
    amount: bookingParams.amount,
    booking_code: data.booking_code,
    description: `Booking payment for ${data.booking_code}`,
    callback_url: "pitchparty://bookings",
    notification_id: process.env.EXPO_PUBLIC_PESAPAL_IPN as string,
    billing_address: bookingParams.billing_address,
  };

  console.log("Making payment request to Pesapal");
  const response = await initiatePayment(payment_data);

  console.log("Payment response", response);

  if (Number(response.status) !== 200) {
    throw new Error("Payment initiation failed");
  }

  console.log("Creating Payment on Supabase");

  const { data: paymentData, error: paymentError } = await supabase
    .from("payments")
    .insert({
      id: payment_data.id,
      booking_id: data.id,
      order_tracking_id: response.order_tracking_id,
      amount: payment_data.amount,
      payment_method: "MOBILE",
      payment_status: "PENDING",
      transaction_reference: response.merchant_reference,
      external_gateway: "Pesapal",
    })
    .select()
    .single();

  console.log("Payment created on Supabase", paymentData, paymentError);

  if (paymentError) throw new Error(paymentError.message);

  console.log("Updating booking with payment details", {
    external_reference: response.merchant_reference,
    payment_id: paymentData.id,
  });

  const { data: updatedBooking, error: updateError } = await supabase
    .from("bookings")
    .update({
      external_reference: response.merchant_reference,
      // payment_id: paymentData.id,
    })
    .eq("id", data.id)
    .select();

  console.log(
    "Booking updated with payment details",
    updatedBooking,
    updateError
  );
  if (updateError) throw new Error(updateError.message);

  return { ...data, paymentResponse: response };
};

/**
 -------------------------------------------------------

 READ BOOKINGS

 -------------------------------------------------------
**/
// Fetch today's bookings for a specific user
export const fetchTodaysBookings = async (venueId: string) => {
  const today = new Date().toISOString().slice(0, 10);
  const { data, error, count } = await supabase
    .from(TABLE_NAME)
    .select(BOOKINGS_SELECT, { count: "exact" })
    .gte("created_at", today)
    .eq("venue_id", venueId);

  if (error) throw error;
  return { data, count };
};

// Fetch pending bookings for a specific user
export const fetchPendingBookings = async (venueId: string) => {
  const { data, error, count } = await supabase
    .from(TABLE_NAME)
    .select(BOOKINGS_SELECT, { count: "exact" })
    .eq("status", "pending")
    .eq("venue_id", venueId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return { data, count };
};

// Fetch user's bookings
export const fetchUserBookings = async (
  userId: string
): Promise<BookingItem[]> => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select(BOOKINGS_SELECT, { count: "exact" })
    .eq("user_id", userId);

  if (error) throw error;

  return data as unknown as BookingItem[];
};

// Fetch a single booking by ID
export const fetchSingleBooking = async (
  params: BookingQueryParams
): Promise<BookingItem> => {
  let query = supabase.from(TABLE_NAME).select();
  console.log("PARAMS INSIDE", params);
  if (params.id) {
    console.log("Params", params.id);
    query = query.eq("id", params.id);
  } else if (params.orderMerchantReference) {
    query = query.eq("external_reference", params.orderMerchantReference);
  } else {
    throw new Error("Either id or orderMerchantReference must be provided");
  }
  const { data, error } = await query.select(BOOKINGS_SELECT);

  console.log("DATA", data, error);

  if (error) throw error;

  return data[0] as unknown as BookingItem;
};

export const fetchManagerBookings = async (
  venueId: string
): Promise<BookingItem[]> => {
  // const today = new Date().toISOString().split("T")[0]; // e.g. '2025-04-12'

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select(BOOKINGS_SELECT, { count: "exact" })
    .eq("venue_id", venueId)
    // .eq("event_date", today)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data as unknown as BookingItem[];
};

export const fetchAllBookings = async (): Promise<BookingItem[]> => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select(BOOKINGS_SELECT, { count: "exact" });

  if (error) throw error;
  return data as unknown as BookingItem[];
};

/**
 -------------------------------------------------------

 UPDATE BOOKINGS

 -------------------------------------------------------
**/

// Confirm a booking
export const confirmBooking = async (bookingId: string) => {
  console.log("CONFIRMING BOOKING", bookingId);
  const { error } = await supabase
    .from(TABLE_NAME)
    .update({ status: "confirmed" })
    .eq("id", bookingId);

  if (error) throw error;
  return;
};

// Cancel a booking
export const cancelBooking = async (bookingId: string) => {
  const user = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .update({
      status: "cancelled",
      cancelled_by: user.data.user?.id,
      cancelled_at: new Date(),
      cancelled_reason: "",
    })
    .eq("id", bookingId)
    .single();

  if (error) throw error;
  return data as unknown as BookingItem;
};

/**
 -------------------------------------------------------

 DELETE BOOKINGS

 -------------------------------------------------------
**/

// // Fetch multiple bookings with filtering and related data
// export const fetchBookings = async (
//   filters: BookingFilter = {}
// ): Promise<BookingResponse> => {
//   let query = supabase.from("bookings").select(
//     `
//         *,
//         payments (*),
//         users (id, name, email)
//       `,
//     { count: "exact" }
//   );

//   // Apply filters if provided
//   if (filters.status) query = query.eq("status", filters.status);
//   if (filters.startDate) query = query.gte("bookingDate", filters.startDate);
//   if (filters.endDate) query = query.lte("bookingDate", filters.endDate);
//   if (filters.userId) query = query.eq("userId", filters.userId);
//   if (filters.venueId) query = query.eq("venueId", filters.venueId);

//   const { data, error, count } = await query;
//   if (error) throw new Error(error.message);
//   return { data: data as Booking[], count: count ?? 0 };
// };

// // Fetch a single booking with related data
// export const fetchBookingById = async (id: string): Promise<BookingResponse> => {
//     const { data, error } = await supabase
//       .from(TABLE_NAME)
//       .select(
//         `
//         *,
//         payments (*),
//         users (id, name, email)
//       `
//       )
//       .eq('id', id)
//       .single();

//     if (error) throw new Error(error.message);
//     return { data: data as Booking, count: 1 };
//   };

//   // Update an existing booking
//   export const updateBooking = async (id: string, updates: Partial<Booking>): Promise<BookingResponse> => {
//     const { data, error } = await supabase
//       .from(TABLE_NAME)
//       .update(updates)
//       .eq('id', id)
//       .select(
//         `
//         *,
//         payments (*),
//         users (id, name, email)
//       `
//       )
//       .single();

//     if (error) throw new Error(error.message);
//     return { data: data as Booking, count: 1 };
//   };

//   // Delete a booking
//   export const deleteBooking = async (id: string): Promise<void> => {
//     const { error } = await supabase.from(TABLE_NAME).delete().eq('id', id);
//     if (error) throw new Error(error.message);
//   };
