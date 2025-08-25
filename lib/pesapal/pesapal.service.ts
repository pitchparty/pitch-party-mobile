// src/pesapal/services/pesapalService.ts
import { pesapalConfig } from "./config";
import {
  PaymentData,
  PaymentParams,
  PaymentResponse,
  TransactionStatus,
} from "./types";

// Token caching variables
let token: string | null | any = null;
let tokenExpiry: number | null = null;

// Get or refresh authentication token
export const getAuthToken = async (): Promise<string> => {
  if (token && tokenExpiry && Date.now() < tokenExpiry) {
    return token; // Return cached token if valid
  }

  try {
    const response = await fetch(
      `${pesapalConfig.baseUrl}${pesapalConfig.authEndpoint}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          consumer_key: pesapalConfig.consumerKey,
          consumer_secret: pesapalConfig.consumerSecret,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Auth request failed with status ${response.status}`);
    }

    const data = await response.json();
    token = data.token;
    // Default to 1 hour expiry if not provided (adjust based on Pesapal docs)
    tokenExpiry = Date.now() + 3600 * 1000;
    return token;
  } catch (error) {
    console.error("Error getting PesaPal auth token:", error);
    throw new Error(`Token generation failed: ${error.message}`);
  }
};

// Initiate a payment
export const initiatePayment = async (
  paymentData: PaymentParams
): Promise<PaymentResponse> => {
  console.log("Initiating payment with data:", paymentData);
  try {
    const token = await getAuthToken();
    const response = await fetch(
      `${pesapalConfig.baseUrl}${pesapalConfig.paymentEndpoint}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(paymentData),
      }
    );

    console.log("Payment initiation response:", response);
    console.log("Payment initiation response status:", response.status);

    if (!response.ok) {
      throw new Error(
        `Payment initiation failed with status ${response.status}`
      );
    }

    return response.json();
  } catch (error) {
    console.error("Error initiating PesaPal payment:", error);
    throw new Error(`Payment initiation failed: ${error.message}`);
  }
};

// Get payment status
export const getPaymentStatus = async (
  orderTrackingId: string
): Promise<TransactionStatus> => {
  try {
    const token = await getAuthToken();
    const response = await fetch(
      `${pesapalConfig.baseUrl}/api/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Status check failed with status ${response.status}`);
    }

    const data: TransactionStatus = await response.json();
    return data;
  } catch (error) {
    console.error("Error getting payment status:", error);
    throw new Error(`Status check failed: ${error.message}`);
  }
};

// Optional: Refresh token manually
export const refreshToken = async (): Promise<string> => {
  token = null; // Invalidate current token
  tokenExpiry = null;
  return await getAuthToken();
};
