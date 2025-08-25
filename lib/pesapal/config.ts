import { isPast } from "date-fns";

export const pesapalConfig = {
  baseUrl: process.env.EXPO_PUBLIC_PESAPAL_URL,
  authEndpoint: "/api/Auth/RequestToken",
  refundEndpoint: "/api/Transactions/RefundRequest",
  paymentEndpoint: "/api/Transactions/SubmitOrderRequest",
  statusEndpoint: "/api/Transactions/GetTransactionStatus",
  consumerKey: process.env.EXPO_PUBLIC_PESAPAL_CONSUMER_KEY,
  consumerSecret: process.env.EXPO_PUBLIC_PESAPAL_CONSUMER_SECRET,
  notification_ipn: process.env.EXPO_PUBLIC_PESAPAL_IPN,
  currency: "KES",
  callbackUrl: "https://your-callback-url.com",
};
