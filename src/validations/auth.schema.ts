import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["STUDENT", "TUTOR"], {
    message: "Please select a role",
  }),
  phone: z.string().regex(/^(?:\+88)?01\d{9}$/, "Must be a valid BD number (e.g. 01712345678)"),
  imgUrl: z.string().url("Invalid image URL").optional().or(z.literal("")),
  
  // Student fields
  grade: z.string().optional(),
  institution: z.string().optional(),
  gender: z.string().optional(),
  interests: z.string().optional(),

  // Tutor fields
  bio: z.string().optional(),
  price: z.coerce.number().min(0, "Price must be positive").optional(), // coerce converts string to number
  experience: z.string().optional(),
  categoryId: z.string().optional().or(z.literal("")),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;