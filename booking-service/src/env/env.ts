import z from "zod";
import "dotenv/config";

const envSchema = z.object({
  DATABASE_URL: z.string(),
  PORT: z.string().default("3002"),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("Invalid environment variables", _env.error);

  throw new Error("Invalid environment variables");
}

export const env = _env.data;
