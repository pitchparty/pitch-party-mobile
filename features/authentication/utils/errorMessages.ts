

const ERROR_CODES: Record<string, string> = {
  otp_expired: "OTP Expired",
  invalid_grant: "Invalid Login Session",
  invalid_request: "Invalid Request",
  user_not_found: "User Not Found",
  access_denied: "Access Denied",
  server_error: "Server Error",
};


export const getErrorCode = (errorCode: string | null): string => {
  return errorCode ? ERROR_CODES[errorCode] || "Unknown Error" : "";
};
