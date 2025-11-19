// src/lib/validation/signUp.ts
import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  tel: z
    .string()
    .min(10, "Telephone must be at least 10 digits")
    .max(15, "Telephone must be at most 15 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["user", "admin"]).optional(), // default role is user
});

export type SignUpFormData = z.infer<typeof signUpSchema>;
