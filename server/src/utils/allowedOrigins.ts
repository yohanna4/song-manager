const corsEnv = process.env.CORS_ORIGINS || "";

export const allowedOrigins: string[] = corsEnv
  ? corsEnv.split(",").map((origin) => origin.trim())
  : [];
