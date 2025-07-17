import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserRoleType } from "@prisma/client";
import { TokenPayload } from "../types";
import { getJwtSecret } from "../utils/env";

class AuthMiddleware {
  verifyToken(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const decoded = jwt.verify(token, getJwtSecret()) as TokenPayload;
      req.user = { id: Number(decoded.id), role: decoded.role as UserRoleType };
      next();
    } catch {
      return res.status(401).json({ error: "Invalid token" });
    }
  }
}

export default new AuthMiddleware();
