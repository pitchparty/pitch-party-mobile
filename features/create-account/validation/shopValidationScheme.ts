import { z } from 'zod';

export const shopSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  address: z.string().optional(),
  longitude: z.number(),
  latitude: z.number(),
  amenities: z.array(z.string()).min(1, 'Please select at least one amenity'),
  capacity: z.string().min(1, 'Capacity is required'),
  pricing: z.string().min(1, 'Pricing details are required'),
  redemption_option: z.enum(['redeemable', 'non-redeemable']),
  contact_phone: z.string().min(10, 'Please enter a valid phone number'),
  contact_email: z.string().email('Invalid email address'),
})

export type ShopFormData = z.infer<typeof shopSchema>;