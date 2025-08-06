import { z } from "zod";

const username = z
  .string()
  .min(5)
  .max(50)
  .refine((username) => !/\s/.test(username), {
    message: "must not contain spaces",
  });

const password = z.string().min(6).max(50);

export const registerSchema = z
  .object({
    username: username,
    password: password,
    confirmPassword: password,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "password not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  username: username,
  password: password,
});

export type RegisterInputSchemaType = z.infer<typeof registerSchema>;
export type LoginInputSchemaType = z.infer<typeof loginSchema>;
