import { z } from "zod";

export const registerSchema = z.object({
  first_name: z.string().min(2),

  last_name: z.string().min(2),

  email: z.email(),

  password: z.string().min(8),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});
