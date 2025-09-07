import { Request, Response, NextFunction } from "express";
import { allowedOrigins } from "../utils/allowedOrigins.js";

export const restrictWriteMethods = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const origin = req.get("origin");
  const isWriteMethod = ["POST", "PATCH", "PUT", "DELETE"].includes(req.method);

  // If allowedOrigins is empty, allow all origins
  if (isWriteMethod && allowedOrigins.length > 0 && (!origin || !allowedOrigins.includes(origin))) {
    return res
      .status(403)
      .json({ message: "Forbidden: Origin not allowed for write operations." });
  }

  next();
};
