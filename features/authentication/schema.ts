import * as z from "zod";

const kenyanPhoneNumberRegex = /^(?:\+254|0)?(?:7\d{8}|10\d{7}|11\d{7})$/;

export const userSchema = z.object({
  first_name: z.string().min(2, "First Name Too Short"),
  last_name: z.string().min(2, "Last Name Too Short"),
  email: z.string().email("Enter a Valid Email"),
  password: z.string().min(4, "Weak Password"),
  username: z.string().min(2, "Username Too Short"),
  phone_number: z
    .string()
    .min(10, "Enter a Valid Phone Number"),
  role: z.enum(["user", "manager", "admin"]),
});


export const profileSchema = z.object({
  first_name: z.string().min(2, "First Name Too Short"),
  last_name: z.string().min(2, "Last Name Too Short"),
  username: z.string().min(3, "Username Too Short"),
  email: z.string().email("Enter a Valid Email"),
  date_of_birth: z.date().optional(),
});


export type UserFormData = z.infer<typeof userSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;


export const initialUserValues: UserFormData = {
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  username: "",
  phone_number: "",
  role: "user",
};

export const initialProfileValues: ProfileFormData = {
  first_name: "",
  last_name: "",
  username: "",
  email: "",
  date_of_birth: undefined,
};