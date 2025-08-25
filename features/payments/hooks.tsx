import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchPayments, createPayment, updatePayment } from './api';
import { Payment } from './types';

// === Payment Hooks ===
// Fetch and cache payments with optional booking filter
export const usePayments = (bookingId?: string) =>
  useQuery({
    queryKey: ['payments', bookingId],
    queryFn: () => fetchPayments(bookingId),
  });

// Create a payment with cache invalidation
export const useCreatePayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
};

// Update a payment with cache invalidation
export const useUpdatePayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Payment> }) => updatePayment(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
};