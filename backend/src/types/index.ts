import { Request } from "express";

export interface TokenPayload {
  userId: number;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

export type Message = {
  success: boolean;
  message: string;
};
