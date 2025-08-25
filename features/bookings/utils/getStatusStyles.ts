import { BookingStatus } from "../types";

const getStatusStyles = (status: BookingStatus) => {
  switch (status) {
    case 'confirmed':
      return { bg: 'bg-green-100', text: 'text-green-600', label: 'Confirmed' };
    case 'pending':
      return { bg: 'bg-amber-100', text: 'text-amber-600', label: 'Pending' };
    case 'cancelled':
      return { bg: 'bg-red-100', text: 'text-red-600', label: 'Cancelled' };
    case 'completed':
      return { bg: 'bg-blue-100', text: 'text-blue-600', label: 'Completed' };
    default:
      return { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Unknown' };
  }
};

export default getStatusStyles;
