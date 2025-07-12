import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest, TokenPayload } from "../types";
import { getJwtSecret } from "../utils/env";

class AuthMiddleware {
  verifyToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Authorization token missing or malformed" });
    }

    const token = authHeader.split(" ")[1];

    const JWT_SECRET = getJwtSecret();

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
  }
}

export default new AuthMiddleware();
