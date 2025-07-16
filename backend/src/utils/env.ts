import { AppError } from "../middlewares/error.middleware";

export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new AppError("Missing JWT_SECRET environment variable", 400);
  return secret;
}
