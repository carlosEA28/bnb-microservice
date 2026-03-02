import z from "zod";
import "dotenv/config";

const envSchema = z.object({
  DATABASE_URL: z.string(),
  AWS_REGION: z.string(),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  AWS_BUCKET_NAME: z.string(),
  PORT: z.string().default("3000"),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("Invalid environment variables", _env.error);

  throw new Error("Invalid environment variables");
}

export const env = _env.data;
