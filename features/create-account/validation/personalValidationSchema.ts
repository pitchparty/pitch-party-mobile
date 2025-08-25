import { z } from 'zod';

// Define validation schema using zod
export const personalSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  phone_number: z.string().min(10, 'Please enter a valid phone number'),
});

export type personalFormData = z.infer<typeof personalSchema>;