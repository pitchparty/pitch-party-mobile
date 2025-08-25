import { Ionicons } from "@expo/vector-icons";

export const getPaymentStatusStyles = (status: string) => {
  switch (status) {
    case "pending":
      return {
        bg: "bg-amber-100",
        text: "text-amber-600",
        label: "Pending",
        icon: "time-outline", // Clock icon
      };
    case "Completed":
      return {
        bg: "bg-green-100",
        text: "text-green-600",
        label: "Paid",
        icon: "checkmark-circle-outline",
      };
    case "failed":
      return {
        bg: "bg-red-100",
        text: "text-red-600",
        label: "Failed",
        icon: "close-circle-outline",
      };
    case "refunded":
      return {
        bg: "bg-blue-100",
        text: "text-blue-600",
        label: "Refunded",
        icon: "arrow-undo-outline",
      };
    default:
      return {
        bg: "bg-gray-100",
        text: "text-gray-600",
        label: "Unknown",
        icon: "help-circle-outline",
      };
  }
};
