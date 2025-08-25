// export interface PesaPalConfig {
//   consumerKey: string;
//   consumerSecret: string;
//   isSandbox: boolean;
//   callbackUrl: string;
// }

// export interface PesaPalPaymentResponse {
//   order_tracking_id: string;
//   payment_status_description: string;
//   payment_status_code: string;
//   payment_method: string;
//   payment_account_description: string;
//   payment_merchant_reference: string;
//   payment_channel: string;
//   payment_date: string;
//   payment_amount: number;
//   payment_currency: string;
//   payment_billing_address: {
//     email_address: string;
//     phone_number: string;
//     country_code: string;
//     first_name: string;
//     last_name: string;
//   };
// }

// export interface PesaPalStatusResponse {
//   payment_status_description: string;
//   payment_status_code: string;
//   payment_method: string;
//   payment_account_description: string;
//   payment_merchant_reference: string;
//   payment_channel: string;
//   payment_date: string;
//   payment_amount: number;
//   payment_currency: string;
// }

export interface PaymentData {
  bookingId: string;
  amount: number;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  paymentMethod: "MPESA" | "CARD";
}

export interface PaymentParams {
  id?: string;
  booking_code?: string;
  currency?: string;
  amount?: string;
  description?: string;
  callback_url?: string;
  notification_id?: string;
  billing_address: BillingAddress;
}

export interface BillingAddress {
  email_address: string;
  phone_number: string;
  country_code: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  line_1?: string;
  line_2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  zip_code?: string;
}

export interface PaymentResponse {
  error: any;
  merchant_reference: string;
  order_tracking_id: string;
  redirect_url: string;
  status: string;
}

export interface TransactionStatus {
  payment_status: string;
  order_tracking_id: string;
  amount: number;
  currency: string;
  [key: string]: any;
}
