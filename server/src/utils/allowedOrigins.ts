const allowedOriginsEnv = process.env.ALLOWED_ORIGINS || "";
export const allowedOrigins = allowedOriginsEnv.split(",").filter(Boolean);
