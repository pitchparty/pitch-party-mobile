import { Booking } from "../bookings/types";

export type PaymentStatus = 'pending' | 'paid' | 'refunded' | 'failed';

export interface Payment {
    id: string;
    bookingId: string;
    paymentCode: string;
    amount: number;
    currency: string;
    paymentMethod: string;
    status: PaymentStatus;
    transactionReference?: string;
    createdAt: string;
    updatedAt: string;
    booking?: Partial<Booking>; // Many-to-one relationship with booking
  }

  export interface PaymentResponse {
    data: Payment | Payment[];
    count: number;
    error?: string;
  }