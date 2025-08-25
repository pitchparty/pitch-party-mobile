import { supabase } from "@/lib/supabase";
import { Payment, PaymentResponse } from "./types";

// Fetch payments with optional booking filter
export const fetchPayments = async (
  bookingId?: string
): Promise<PaymentResponse> => {
  let query = supabase.from("payments").select(
    `
        *,
        bookings (
          id,
          bookingCode,
          event,
          bookingDate,
          status
        )
      `,
    { count: "exact" }
  );

  if (bookingId) query = query.eq("bookingId", bookingId);

  const { data, error, count } = await query;
  if (error) throw new Error(error.message);
  return { data: data as Payment[], count: count ?? 0 };
};

// Create a new payment
export const createPayment = async (
  payment: Omit<Payment, "id" | "createdAt" | "updatedAt" | "booking">
): Promise<PaymentResponse> => {
  const { data, error } = await supabase
    .from("payments")
    .insert(payment)
    .select(
      `
        *,
        bookings (
          id,
          bookingCode,
          event,
          bookingDate,
          status
        )
      `
    )
    .single();

  if (error) throw new Error(error.message);
  return { data: data as Payment, count: 1 };
};

// Update an existing payment
export const updatePayment = async (
  id: string,
  updates: Partial<Payment>
): Promise<PaymentResponse> => {
  const { data, error } = await supabase
    .from("payments")
    .update(updates)
    .eq("id", id)
    .select(
      `
        *,
        bookings (
          id,
          bookingCode,
          event,
          bookingDate,
          status
        )
      `
    )
    .single();

  if (error) throw new Error(error.message);
  return { data: data as Payment, count: 1 };
};
