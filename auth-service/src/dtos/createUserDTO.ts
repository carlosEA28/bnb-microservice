import z from "zod";

export const CreateUserDto = z.object({
  name: z.string().min(1, "Name is required"),
  email: z
    .string()
    .email("Please, provide a valid email")
    .min(1, "Email is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[0-9]/, "Password must contain at least 1 number")
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least 1 special character",
    )
    .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter")
    .regex(/[a-z]/, "Password must contain at least 1 lowercase letter"),
  imageUrl: z.string().optional(),
  cognitoId: z.string().optional(),
});

export type CreateUserDto = z.infer<typeof CreateUserDto>;
