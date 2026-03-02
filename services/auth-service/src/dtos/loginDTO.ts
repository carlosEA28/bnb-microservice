import z from "zod";

export const LoginDto = z.object({
  email: z.email("Please, provide a valid email").min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

export type LoginDto = z.infer<typeof LoginDto>;
